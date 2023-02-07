import { expect } from "chai";
import { ethers } from "hardhat";
import { Library } from "../typechain-types/Library";
describe("Library", function () {
  let libraryFactory;
  let library: Library;
  before(async () => {
    libraryFactory = await ethers.getContractFactory("Library");
    library = await libraryFactory.deploy();
    await library.deployed();
  });
  it("Should add book", async function () {
    await library.addBook("Book 1", "Stan", 1);
    
    var availableBooks = await library.getAvailableBooks();

    expect(availableBooks).to.be.an('array');
    expect(availableBooks.length).to.be.equal(1);
  });
  it("Should add another book", async function () {
    await library.addBook("Book 2", "Ivan", 5);
    
    let availableBooks = await library.getAvailableBooks();

    expect(availableBooks).to.be.an('array');
    expect(availableBooks.length).to.be.equal(2);
  });
  it("Should borrow book", async function () {
    await library.borrowBook(1);
  });
  it("Should not be able to borrow book", async function () {
    expect(library.borrowBook(1)).to.be.revertedWith('You do not meet the book requirement.');
  });
  it("Should not be able to borrow book due to copies", async function () {
    await library.borrowBook(0);

    const [owner, addr1] = await ethers.getSigners();
    expect(library.connect(addr1).borrowBook(0)).to.be.revertedWith('There are no available copies left.');
  });
  it("Should be able to return book", async function () {
    await library.returnBook(0);
    let availableBooks = await library.getAvailableBooks();
    expect(availableBooks.length).to.be.equal(2);
  });
  it("Should not be able to return book", async function () {
    await library.borrowBook(0);
    expect(library.borrowBook(0)).to.be.revertedWith('You do not meet the book requirement.');
  });
  it("Should see available books count increment", async function () {
    let availableBooks = await library.getAvailableBooks();
    expect(availableBooks.length).to.be.equal(1);

    await library.returnBook(0);
    
    availableBooks = await library.getAvailableBooks();
    expect(availableBooks.length).to.be.equal(2);
  });
  it("Should throw on trying to add book with not the owner", async function () {
    const [owner, addr1] = await ethers.getSigners();
    expect(library.connect(addr1).addBook("Book 1", "Stan", 5)).to.be.revertedWith('Not invoked by the owner');
  });
  it("Should get history", async function () {
        let bookHistory = await library.getBookHistory(0);
        expect(bookHistory).to.be.an('array');
        expect(bookHistory.length).to.be.equal(1);

        const [owner] = await ethers.getSigners();
        expect(bookHistory[0]).to.be.equal(owner.address);
  });
});

