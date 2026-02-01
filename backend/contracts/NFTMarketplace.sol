// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    struct Collection {
        uint256 collectionId;
        address creator;
        string name;
        string symbol;
        string description;
        uint256 itemCount;
    }

    uint256 private _currentTokenId = 0;
    uint256 private _currentItemId = 0;
    uint256 private _currentCollectionId = 0;

    mapping(uint256 => MarketItem) private idToMarketItem;
    mapping(uint256 => Collection) private collections;
    mapping(address => uint256[]) private userNFTs;
    mapping(address => uint256) private creatorEarnings;
    mapping(uint256 => uint256[]) private collectionItems;

    uint256 public listingFee = 0.025 ether; // Phí mint NFT (cố định)
    uint256 public constant marketplaceFeePercent = 25; // 2.5% phí giao dịch (chia 1000)

    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    event ItemSold(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address buyer,
        uint256 price
    );

    event CollectionCreated(
        uint256 indexed collectionId,
        address indexed creator,
        string name,
        string symbol
    );

    constructor() ERC721("NFT Marketplace", "NFTM") Ownable(msg.sender) {}

    // Mint NFT mới
    // Mint NFT mới
    function createToken(string memory _tokenURI, uint256 collectionId) 
        public 
        payable 
        returns (uint256) 
    {
        require(msg.value >= listingFee, "Insufficient listing fee");
        
        uint256 newTokenId = _currentTokenId;
        _currentTokenId++;
        
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        
        // Tạo market item
        _currentItemId++;
        uint256 itemId = _currentItemId;
        
        idToMarketItem[itemId] = MarketItem(
            itemId,
            address(this),
            newTokenId,
            payable(msg.sender),
            payable(msg.sender),
            0,
            false
        );

        // Thêm vào collection nếu có
        if (collectionId > 0) {
            collectionItems[collectionId].push(itemId);
            collections[collectionId].itemCount++;
        }

        // Lưu NFT của user
        userNFTs[msg.sender].push(itemId);

        emit MarketItemCreated(
            itemId,
            address(this),
            newTokenId,
            msg.sender,
            msg.sender,
            0,
            false
        );

        return newTokenId;
    }

    // List NFT để bán
    function listNFTForSale(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Not NFT owner");
        require(price > 0, "Price must be positive");

        uint256 itemId = _findItemIdByTokenId(tokenId);
        idToMarketItem[itemId].price = price;
        idToMarketItem[itemId].seller = payable(msg.sender);
        idToMarketItem[itemId].sold = false;
    }

    // Mua NFT
    function buyNFT(uint256 itemId) public payable nonReentrant {
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        
        require(msg.value == price, "Please submit the asking price");
        require(!idToMarketItem[itemId].sold, "Item already sold");

        address seller = idToMarketItem[itemId].seller;
        
        // Chuyển NFT
        _transfer(idToMarketItem[itemId].owner, msg.sender, tokenId);
        
        // Chuyển tiền
        uint256 fee = (price * marketplaceFeePercent) / 1000; // 2.5% của giá bán
        uint256 sellerProceeds = price - fee;
        
        (bool success, ) = payable(seller).call{value: sellerProceeds}("");
        require(success, "Transfer to seller failed");
        creatorEarnings[owner()] += fee; // Phí cho platform

        // Cập nhật item
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;
        idToMarketItem[itemId].seller = payable(address(0));

        // Cập nhật user NFTs
        _removeFromUserNFTs(seller, itemId);
        userNFTs[msg.sender].push(itemId);

        emit ItemSold(
            itemId,
            address(this),
            tokenId,
            seller,
            msg.sender,
            price
        );
    }

    // Tạo collection mới
    function createCollection(
        string memory name,
        string memory symbol,
        string memory description
    ) public returns (uint256) {
        _currentCollectionId++;
        uint256 newCollectionId = _currentCollectionId;
        
        collections[newCollectionId] = Collection({
            collectionId: newCollectionId,
            creator: msg.sender,
            name: name,
            symbol: symbol,
            description: description,
            itemCount: 0
        });

        emit CollectionCreated(newCollectionId, msg.sender, name, symbol);
        return newCollectionId;
    }

    // Lấy tất cả NFT đang bán
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _currentItemId;
        uint256 unsoldItemCount = 0;
        
        for (uint256 i = 1; i <= itemCount; i++) {
            if (!idToMarketItem[i].sold && idToMarketItem[i].price > 0) {
                unsoldItemCount++;
            }
        }

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i <= itemCount; i++) {
            if (!idToMarketItem[i].sold && idToMarketItem[i].price > 0) {
                items[currentIndex] = idToMarketItem[i];
                currentIndex++;
            }
        }
        
        return items;
    }

    // Lấy NFT của user
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 itemCount = userNFTs[msg.sender].length;
        MarketItem[] memory items = new MarketItem[](itemCount);
        
        for (uint256 i = 0; i < itemCount; i++) {
            uint256 itemId = userNFTs[msg.sender][i];
            items[i] = idToMarketItem[itemId];
        }
        
        return items;
    }

    // Helper functions
    function _findItemIdByTokenId(uint256 tokenId) private view returns (uint256) {
        for (uint256 i = 1; i <= _currentItemId; i++) {
            if (idToMarketItem[i].tokenId == tokenId) {
                return i;
            }
        }
        revert("Item not found");
    }

    function _removeFromUserNFTs(address user, uint256 itemId) private {
        uint256[] storage userItems = userNFTs[user];
        for (uint256 i = 0; i < userItems.length; i++) {
            if (userItems[i] == itemId) {
                userItems[i] = userItems[userItems.length - 1];
                userItems.pop();
                break;
            }
        }
    }

    // Override required functions
    // Override required functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}