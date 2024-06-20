//const {time,loadFixture,} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
//const { expect } = require("chai");

//describe("Lock", function () {
//   // We define a fixture to reuse the same setup in every test.
//   // We use loadFixture to run this setup once, snapshot that state,
//   // and reset Hardhat Network to that snapshot in every test.
//async function deployOneYearLockFixture() {
//     const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
//     const ONE_GWEI = 1_000_000_000;

//     const lockedAmount = ONE_GWEI;
//     const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

//     // Contracts are deployed using the first signer/account by default
//     const [owner, otherAccount] = await ethers.getSigners();

//     const Lock = await ethers.getContractFactory("Lock");
//     const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

//     return { lock, unlockTime, lockedAmount, owner, otherAccount };
//   }

//   describe("Deployment", function () {
//     it("Should set the right unlockTime", async function () {
//       const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

//       expect(await lock.unlockTime()).to.equal(unlockTime);
//     });

//     it("Should set the right owner", async function () {
//       const { lock, owner } = await loadFixture(deployOneYearLockFixture);

//       expect(await lock.owner()).to.equal(owner.address);
//     });

//     it("Should receive and store the funds to lock", async function () {
//       const { lock, lockedAmount } = await loadFixture(
//         deployOneYearLockFixture
//       );

//       expect(await ethers.provider.getBalance(lock.target)).to.equal(
//         lockedAmount
//       );
//     });

//     it("Should fail if the unlockTime is not in the future", async function () {
//       // We don't use the fixture here because we want a different deployment
//       const latestTime = await time.latest();
//       const Lock = await ethers.getContractFactory("Lock");
//       await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
//         "Unlock time should be in the future"
//       );
//     });
//   });

//   describe("Withdrawals", function () {
//     describe("Validations", function () {
//       it("Should revert with the right error if called too soon", async function () {
//         const { lock } = await loadFixture(deployOneYearLockFixture);

//         await expect(lock.withdraw()).to.be.revertedWith(
//           "You can't withdraw yet"
//         );
//       });

//       it("Should revert with the right error if called from another account", async function () {
//         const { lock, unlockTime, otherAccount } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         // We can increase the time in Hardhat Network
//         await time.increaseTo(unlockTime);

//         // We use lock.connect() to send a transaction from another account
//         await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
//           "You aren't the owner"
//         );
//       });

//       it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
//         const { lock, unlockTime } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         // Transactions are sent using the first signer by default
//         await time.increaseTo(unlockTime);

//         await expect(lock.withdraw()).not.to.be.reverted;
//       });
//     });

//     describe("Events", function () {
//       it("Should emit an event on withdrawals", async function () {
//         const { lock, unlockTime, lockedAmount } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         await time.increaseTo(unlockTime);

//         await expect(lock.withdraw())
//           .to.emit(lock, "Withdrawal")
//           .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
//       });
//     });

//     describe("Transfers", function () {
//       it("Should transfer the funds to the owner", async function () {
//         const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         await time.increaseTo(unlockTime);

//         await expect(lock.withdraw()).to.changeEtherBalances(
//           [owner, lock],
//           [lockedAmount, -lockedAmount]
//         );
//       });
//     });
//   });
// });


const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("DocStorage Contract", function() {
  let DocStorage;
  let docStorage;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    DocStorage = await ethers.getContractFactory("DocStorage");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    //deploy the contract
    docStorage = await DocStorage.deploy();
    await docStorage.deployed();
  });
  it("Should create a new user", async function() {
    await docStorage.connect(addr1).createUser("user1@example.com");
    const userEmail = await docStorage.getUserEmail(addr1.address);
    expect(userEmail).to.equal("user1@example.com");
  });

  it("Should upload a document", async function() {
    await docStorage.connect(addr1).createUser("user1@example.com");
    await docStorage.connect(addr1).paySubscription({ value: ethers.utils.parseEther("1.0") });
    const tx = await docStorage.connect(addr1).uploadDocument("QmExampleHash");
    const receipt = await tx.wait();
    const documentId = receipt.events[1].args.documentId;
    const userDocuments = await docStorage.getUserDocuments();
    expect(userDocuments).to.include(documentId);
  });

  it("Should add and remove trustees", async function() {
    await docStorage.connect(addr1).createUser("user1@example.com");
    await docStorage.connect(addr1).paySubscription({ value: ethers.utils.parseEther("1.0") });
    const tx = await docStorage.connect(addr1).uploadDocument("QmExampleHash");
    const receipt = await tx.wait();
    const documentId = receipt.events[1].args.documentId;

    await docStorage.connect(addr1).addTrustee(documentId, addr2.address);
    expect(await docStorage.isTrustee(documentId, addr2.address)).to.be.true;

    await docStorage.connect(addr1).removeTrustee(documentId, addr2.address);
    expect(await docStorage.isTrustee(documentId, addr2.address)).to.be.false;
  });

  it("SHould retrieve document with correct fee", async function () {
    await docStorage.connect(addr1).createUser("user1@example.com");
    await docStorage.connect(addr1).paySubscription({ value: ethers.utils.parseEther("1.0") });
    const tx = await docStorage.connect(addr1).uploadDocument("QmExampleHash");
    const receipt = await tx.wait();
    const documentId = receipt.events[1].args.documentId;

    await expect(
      docStorage.connect(addr1).getDocument(documentId, { value: ethers.utils.parseEther("2.0") })
    ).to.emit(docStorage, "DocumentUploaded")
      .withArgs(documentId, addr1.address, "QmExampleHash");

    const ipfsHash = await docStorage.getDocument(documentId, { value: ethers.utils.parseEther("2.0") });
    expect(ipfsHash).to.equal("QmExampleHash");
  });

  it("Should fail to retrieve document with incorrect fee,", async function (){
    await docStorage.connect(addr1).createUser("user1@example.com");
    await docStorage.connect(addr1).paySubscription({ value: ethers.utils.parseEther("1.0") });
    const tx = await docStorage.connect(addr1).uploadDocument("QmExampleHash");
    const receipt = await tx.wait();
    const documentId = receipt.events[1].args.documentId;

    await expect(
      docStorage.connect(addr1).getDocument(documentId, { value: ethers.utils.parseEther("1.0") })
    ).to.be.revertedWith("Incorrect retrieval fee");
  });
  it("Should list all trustees for a document", async function () {
    await docStorage.connect(addr1).createUser("user1@example.com");
    await docStorage.connect(addr1).paySubscription({ value: ethers.utils.parseEther("1.0") });
    const tx = await docStorage.connect(addr1).uploadDocument("QmExampleHash");
    const receipt = await tx.wait();
    const documentId = receipt.events[1].args.documentId;

    await docStorage.connect(addr1).addTrustee(documentId, addr2.address);
    const trustees = await docStorage.getDocumentTrustees(documentId);
    expect(trustees).to.include(addr2.address); 
  });
})