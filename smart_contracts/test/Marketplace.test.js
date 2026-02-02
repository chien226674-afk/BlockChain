const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT Marketplace", function () {
  let NFT;
  let Marketplace;
  let nft;
  let marketplace;
  let deployer;
  let addr1;
  let addr2;
  let addrs;
  let URI = "mock_uri";

  beforeEach(async function () {
    [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();

    const NFTFactory = await ethers.getContractFactory("NFT");
    nft = await NFTFactory.deploy();

    const MarketplaceFactory = await ethers.getContractFactory("Marketplace");
    marketplace = await MarketplaceFactory.deploy();
  });

  describe("Deployment", function () {
    it("Should track name and symbol of the nft collection", async function () {
      expect(await nft.name()).to.equal("BlockchainNFT");
      expect(await nft.symbol()).to.equal("BNFT");
    });
  });

  describe("Minting NFTs", function () {
    it("Should track each minted NFT", async function () {
      await nft.connect(addr1).mintNFT(addr1.address, URI);
      expect(await nft.tokenCount()).to.equal(1n);
      expect(await nft.balanceOf(addr1.address)).to.equal(1n);
      expect(await nft.tokenURI(1)).to.equal(URI);

      await nft.connect(addr2).mintNFT(addr2.address, URI);
      expect(await nft.tokenCount()).to.equal(2n);
      expect(await nft.balanceOf(addr2.address)).to.equal(1n);
      expect(await nft.tokenURI(2)).to.equal(URI);
    });
  });

  describe("Marketplace items", function () {
    beforeEach(async function () {
      await nft.connect(addr1).mintNFT(addr1.address, URI);
      await nft.connect(addr1).setApprovalForAll(await marketplace.getAddress(), true);
    });

    it("Should make item", async function () {
      await expect(marketplace.connect(addr1).makeItem(await nft.getAddress(), 1, 100))
        .to.emit(marketplace, "Offered")
        .withArgs(
          1,
          await nft.getAddress(),
          1,
          100,
          addr1.address
        );

      expect(await nft.ownerOf(1)).to.equal(await marketplace.getAddress());
      expect(await marketplace.itemCount()).to.equal(1n);

      const item = await marketplace.items(1);
      expect(item.itemId).to.equal(1n);
      expect(item.nft).to.equal(await nft.getAddress());
      expect(item.tokenId).to.equal(1n);
      expect(item.price).to.equal(100n);
      expect(item.sold).to.equal(false);
    });

    it("Should fail if price is set to zero", async function () {
      await expect(
        marketplace.connect(addr1).makeItem(await nft.getAddress(), 1, 0)
      ).to.be.revertedWith("Price must be greater than zero");
    });
  });

  describe("Purchasing marketplace items", function () {
    let price;
    let totalPrice;

    beforeEach(async function () {
      price = ethers.parseEther("1"); 
      totalPrice = price;

      await nft.connect(addr1).mintNFT(addr1.address, URI);
      await nft.connect(addr1).setApprovalForAll(await marketplace.getAddress(), true);
      await marketplace.connect(addr1).makeItem(await nft.getAddress(), 1, price);
    });

    it("Should update item as sold, pay seller, transfer NFT to buyer", async function () {
      const sellerInitialEthBal = await ethers.provider.getBalance(addr1.address);

      await expect(marketplace.connect(addr2).purchaseItem(1, { value: totalPrice }))
        .to.emit(marketplace, "Bought")
        .withArgs(
          1,
          await nft.getAddress(),
          1,
          price,
          addr1.address,
          addr2.address
        );
      
      const sellerFinalEthBal = await ethers.provider.getBalance(addr1.address);
      
      expect((await marketplace.items(1)).sold).to.equal(true);
      
      // In Ethers v6, using BigInt arithmetic
      expect(sellerFinalEthBal).to.equal(sellerInitialEthBal + price); 

      expect(await nft.ownerOf(1)).to.equal(addr2.address);
    });
  });
});
