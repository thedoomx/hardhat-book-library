const { ethers } = require("ethers");

const Library = require('../artifacts/contracts/Library.sol/Library.json') // You can copy also the compiled contract
const run = async function () {
    const libraryContract = await _setup();
    //console.log(libraryContract);

    let availableBooks = await libraryContract.getAvailableBooks();
    let availableBooksLength = availableBooks.length;

    if (await _addBook(libraryContract, availableBooksLength) == false) {
        return;
    }

    if (await _borrowBook(libraryContract, availableBooksLength) == false) {
        return;
    }

    availableBooks = await libraryContract.getAvailableBooks();
    availableBooksLength = availableBooks.length;
    console.log("Available books after borrow:", availableBooksLength);
    console.log("Total books:", availableBooksLength + 1);

    if (await _returnBook(libraryContract, availableBooksLength) == false) {
        return;
    }

    availableBooks = await libraryContract.getAvailableBooks();
    console.log("Available books after return:", availableBooks.length);

    return;
}

async function _addBook(libraryContract, availableBooksLength) {
    const transactionAddBook = await libraryContract.addBook("Book " + availableBooksLength + 1, "Ivan", 1);
    const transactionAddBookReceipt = await transactionAddBook.wait();

    if (transactionAddBookReceipt.status != 1) {
        console.log("Transaction for add book was not successful");
        return false;
    }

    return true;
}

async function _borrowBook(libraryContract, availableBooksLength) {
    const transactionBorrowBook = await libraryContract.borrowBook(availableBooksLength);
    const transactionBorrowBookReceipt = await transactionBorrowBook.wait();

    if (transactionBorrowBookReceipt.status != 1) {
        console.log("Transaction for borrow book was not successful");
        return false;
    }

    return true;
}

async function _returnBook(libraryContract, availableBooksLength) {
    const transactionReturnBook = await libraryContract.returnBook(availableBooksLength);
    const transactionReturnBookReceipt = await transactionReturnBook.wait();

    if (transactionReturnBookReceipt.status != 1) {
        console.log("Transaction for return book was not successful");
        return false;
    }

    return true;
}

async function _setup() {
    const provider = new ethers.providers.InfuraProvider("goerli", "62349f810c5c46389814d8e614bd6ef9")
    const latestBlock = await provider.getBlock("latest");
    const wallet = new ethers.Wallet("12fced7dda78291cfec5a3b9122c442c108ebbaa2c4791563fae1076c1513f09", provider);
    const balance = await wallet.getBalance();
    //console.log("Balance:" + balance);
    const contractAddress = "0x5E6a5d6658F11A9c84A410d46c3EFa5299b6B9d4";
    const libraryContract = new ethers.Contract(contractAddress, Library.abi, wallet);

    return libraryContract;
}

run()
