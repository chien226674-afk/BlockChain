// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    event NFTMinted(uint256 indexed tokenId, address indexed creator);

    constructor() ERC721("BlockchainNFT", "BNFT") Ownable(msg.sender) {}

    function mintNFT(address recipient, string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIds++;
        uint256 newItemId = _tokenIds;
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        emit NFTMinted(newItemId, recipient);

        return newItemId;
    }

    function tokenCount() public view returns (uint256) {
        return _tokenIds;
    }
}
