const { ethers } = require("ethers");

const Library = require('../artifacts/contracts/Library.sol/Library.json') // You can copy also the compiled contract
const run = async function () {
    const libraryContract = await _setup();
    //console.log(libraryContract);

    let availableBooks = await libraryContract.getAvailableBooks();

    const transactionAddBook = await libraryContract.addBook("Book " + availableBooks.length + 1, "Ivan", 1);
    const transactionAddBookReceipt = await transactionAddBook.wait();

    if (transactionAddBookReceipt.status != 1) {
        console.log("Transaction for add book was not successful");
        return;
    }

    const transactionBorrowBook = await libraryContract.borrowBook(availableBooks.length);
    const transactionBorrowBookReceipt = await transactionBorrowBook.wait();

    if (transactionBorrowBookReceipt.status != 1) {
        console.log("Transaction for borrow book was not successful");
        return;
    }

    availableBooks = await libraryContract.getAvailableBooks();
    console.log("Available books after borrow:", availableBooks.length);
    console.log("Total books:", availableBooks.length + 1);

    const transactionReturnBook = await libraryContract.returnBook(availableBooks.length);
    const transactionReturnBookReceipt = await transactionReturnBook.wait();

    if (transactionReturnBookReceipt.status != 1) {
        console.log("Transaction for return book was not successful");
        return;
    }

    availableBooks = await libraryContract.getAvailableBooks();
    console.log("Available books after return:", availableBooks.length);

    return;
}

async function _setup() {
    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545")
    const latestBlock = await provider.getBlock("latest");
    const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    const balance = await wallet.getBalance();
    //console.log("Balance:" + balance);
    const contractAddress = "0x1fA02b2d6A771842690194Cf62D91bdd92BfE28d";
    const libraryContract = new ethers.Contract(contractAddress, Library.abi, wallet);

    return libraryContract;
}

run()
