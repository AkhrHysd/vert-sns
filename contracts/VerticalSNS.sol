// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VerticalSNS {
    struct Tree {
        address parent;
        address[] children;
    }

    struct User {
        string username;
        bytes32 uniqueId;
        mapping(bytes32 => Tree) trees;
    }

    mapping(address => User) public users;

    // ユーザー名を更新する関数
    function updateUsername(string memory newUsername) public {
        require(bytes(newUsername).length > 0, "Username cannot be empty");
        users[msg.sender].username = newUsername;
    }

    // 以下に他の関数の実装を追加していく
}