import { expect } from "chai";
import { ethers } from "hardhat";

describe("StringEscrow", function () {
  let Token, token, EscrowContract, escrowContract;
  let addr1, addr2, feeAccount;
  const feePercent = 10;

  beforeEach(async function () {
    [owner, addr1, addr2, feeAccount] = await ethers.getSigners();

    Token = await ethers.getContractFactory("ERC20Mock");
    token = await Token.deploy("Test Token", "TST", 18, ethers.utils.parseEther("1000"));
    await token.deployed();

    EscrowContract = await ethers.getContractFactory("StringEscrow");
    escrowContract = await EscrowContract.deploy(token.address, feeAccount.address, feePercent);
    await escrowContract.deployed();

    // Distribute tokens to addr1 and addr2
    await token.transfer(addr1.address, ethers.utils.parseEther("100"));
    await token.transfer(addr2.address, ethers.utils.parseEther("100"));
  });

  describe("createEscrow", function () {
    it("should create an escrow successfully", async function () {
      await token.connect(addr1).approve(escrowContract.address, ethers.utils.parseEther("10"));
      await expect(escrowContract.connect(addr1).createEscrow(ethers.utils.parseEther("10"), "hello"))
        .to.emit(escrowContract, "EscrowCreated")
        .withArgs(0, addr1.address, ethers.utils.parseEther("10"), "hello");

      const escrow = await escrowContract.escrows(0);
      expect(escrow.user1).to.equal(addr1.address);
      expect(escrow.string1).to.equal("hello");
      expect(escrow.amount).to.equal(ethers.utils.parseEther("10"));
      expect(escrow.filled).to.equal(false);
    });

    it("should fail if amount is zero", async function () {
      await token.connect(addr1).approve(escrowContract.address, ethers.utils.parseEther("10"));
      await expect(escrowContract.connect(addr1).createEscrow(0, "hello")).to.be.revertedWith(
        "Amount must be greater than 0",
      );
    });

    it("should fail if token transfer fails", async function () {
      await expect(
        escrowContract.connect(addr1).createEscrow(ethers.utils.parseEther("10"), "hello"),
      ).to.be.revertedWith("Token transfer failed");
    });
  });

  describe("fillEscrow", function () {
    beforeEach(async function () {
      await token.connect(addr1).approve(escrowContract.address, ethers.utils.parseEther("10"));
      await escrowContract.connect(addr1).createEscrow(ethers.utils.parseEther("10"), "hello");
    });

    it("should fill escrow and resolve correctly when the second string is longer", async function () {
      await token.connect(addr2).approve(escrowContract.address, ethers.utils.parseEther("10"));
      await expect(escrowContract.connect(addr2).fillEscrow(0, "helloworld"))
        .to.emit(escrowContract, "EscrowFilled")
        .withArgs(0, addr2.address, ethers.utils.parseEther("10"), "helloworld");

      const totalAmount = ethers.utils.parseEther("20");
      const feeAmount = totalAmount.mul(feePercent).div(100);
      const winnerAmount = totalAmount.sub(feeAmount);

      await expect(escrowContract.connect(addr2).fillEscrow(0, "helloworld"))
        .to.emit(escrowContract, "EscrowResolved")
        .withArgs(0, addr2.address, winnerAmount, feeAccount.address, feeAmount);

      expect(await token.balanceOf(addr2.address)).to.equal(ethers.utils.parseEther("90").add(winnerAmount));
      expect(await token.balanceOf(feeAccount.address)).to.equal(feeAmount);
    });

    it("should fill escrow and resolve correctly when the first string is longer", async function () {
      await token.connect(addr2).approve(escrowContract.address, ethers.utils.parseEther("10"));
      await expect(escrowContract.connect(addr2).fillEscrow(0, "hi"))
        .to.emit(escrowContract, "EscrowFilled")
        .withArgs(0, addr2.address, ethers.utils.parseEther("10"), "hi");

      const totalAmount = ethers.utils.parseEther("20");
      const feeAmount = totalAmount.mul(feePercent).div(100);
      const winnerAmount = totalAmount.sub(feeAmount);

      await expect(escrowContract.connect(addr2).fillEscrow(0, "hi"))
        .to.emit(escrowContract, "EscrowResolved")
        .withArgs(0, addr1.address, winnerAmount, feeAccount.address, feeAmount);

      expect(await token.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("90").add(winnerAmount));
      expect(await token.balanceOf(feeAccount.address)).to.equal(feeAmount);
    });

    it("should fail if escrow is already filled", async function () {
      await token.connect(addr2).approve(escrowContract.address, ethers.utils.parseEther("10"));
      await escrowContract.connect(addr2).fillEscrow(0, "helloworld");
      await expect(escrowContract.connect(addr2).fillEscrow(0, "anotherstring")).to.be.revertedWith(
        "Escrow already filled",
      );
    });

    it("should fail if token transfer fails", async function () {
      await expect(escrowContract.connect(addr2).fillEscrow(0, "helloworld")).to.be.revertedWith(
        "Token transfer failed",
      );
    });
  });
});
