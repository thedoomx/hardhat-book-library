// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract LibraryHistory {
    mapping(uint => address[]) internal _bookBorrowHistory;

    mapping(address => mapping(uint => bool)) internal _addressEverBorrowed;

    function _addBookHistory(uint _bookId, address userAddress) internal {
        if(_addressEverBorrowed[userAddress][_bookId] == false) {
            _addressEverBorrowed[userAddress][_bookId] = true;
            _bookBorrowHistory[_bookId].push(userAddress);
        }
    }

    function getBookHistory(uint _bookId) external view returns(address[] memory) {
        return _bookBorrowHistory[_bookId];
    }
}