// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VerticalSNS {
    struct Tree {
        address[] parent;
        address[] children;
    }

    struct User {
        bytes32 uniqueId;
        mapping(bytes32 => Tree) trees;
    }

    mapping(address => User) public users;
    
    function registerUser(bytes32 uniqueId) public {
        require(users[msg.sender].uniqueId == 0, "User already registered");
        users[msg.sender].uniqueId = uniqueId;
    }

    function getUserUniqueId(address userAddress) public view returns (bytes32) {
        return users[userAddress].uniqueId;
    }

    function addParent(bytes32 treeId, address parentAddress) public {
        require(users[msg.sender].uniqueId != 0, "User not registered");
        require(users[parentAddress].uniqueId != 0, "Parent user not registered");

        Tree storage userTree = users[msg.sender].trees[treeId];
        Tree storage parentTree = users[parentAddress].trees[treeId];

        userTree.parent.push(parentAddress);
        parentTree.children.push(msg.sender);
    }

    function getConnection(address user, bytes32 treeId) public view returns (address[] memory parent, address[] memory children) {
        require(users[user].uniqueId != 0, "User not registered");
        return (users[user].trees[treeId].parent, users[user].trees[treeId].children);
    }

    function removeConnection(address parent, address child) public {
        require(users[parent].uniqueId != 0, "Parent not registered");
        require(users[child].uniqueId != 0, "Child not registered");

        bytes32 parentUniqueId = users[parent].uniqueId;
        bytes32 childUniqueId = users[child].uniqueId;

        uint256 parentIndex = findChildIndex(parent, child);
        uint256 childIndex = findParentIndex(child, parent);

        if (parentIndex < users[parent].trees[childUniqueId].children.length) {
            users[parent].trees[childUniqueId].children[parentIndex] = users[parent].trees[childUniqueId].children[users[parent].trees[childUniqueId].children.length - 1];
            users[parent].trees[childUniqueId].children.pop();
        }

        if (childIndex < users[child].trees[parentUniqueId].parent.length) {
            users[child].trees[parentUniqueId].parent[childIndex] = users[child].trees[parentUniqueId].parent[users[child].trees[parentUniqueId].parent.length - 1];
            users[child].trees[parentUniqueId].parent.pop();
        }
    }

    function findChildIndex(address parent, address child) internal view returns (uint256) {
        bytes32 childUniqueId = users[child].uniqueId;
        for (uint256 i = 0; i < users[parent].trees[childUniqueId].children.length; i++) {
            if (users[parent].trees[childUniqueId].children[i] == child) {
                return i;
            }
        }
        return users[parent].trees[childUniqueId].children.length;
    }

    function findParentIndex(address child, address parent) internal view returns (uint256) {
        bytes32 parentUniqueId = users[parent].uniqueId;
        for (uint256 i = 0; i < users[child].trees[parentUniqueId].parent.length; i++) {
            if (users[child].trees[parentUniqueId].parent[i] == parent) {
                return i;
            }
        }
        return users[child].trees[parentUniqueId].children.length;
    }
    function isConnected(address parent, address child) public view returns (bool) {
        bytes32 parentId = users[parent].uniqueId;
        Tree storage tree = users[child].trees[parentId];
        return tree.parent.length > 0;
    }

    function _removeConnection(address parent, address child) internal {
        bytes32 parentId = users[parent].uniqueId;
        bytes32 childId = users[child].uniqueId;
        // 親ユーザーから子ユーザーを削除
        Tree storage parentTree = users[parent].trees[childId];
        for (uint i = 0; i < parentTree.children.length; i++) {
            if (parentTree.children[i] == child) {
                parentTree.children[i] = parentTree.children[parentTree.children.length - 1];
                parentTree.children.pop();
                break;
            }
        }

        // 子ユーザーから親ユーザーを削除
        Tree storage childTree = users[child].trees[parentId];
        for (uint i = 0; i < childTree.parent.length; i++) {
            if (childTree.parent[i] == parent) {
                childTree.parent[i] = childTree.parent[childTree.parent.length - 1];
                childTree.parent.pop();
                break;
            }
        }
    }

    function removeConnectionFromChild(address parent) public {
    // 子ユーザーが自分自身の親子関係を削除できるように、msg.senderを子ユーザーとして使用
    address child = msg.sender;

    // 親子関係が存在することを確認
    require(isConnected(parent, child), "Parent and child are not connected");

    // 親子関係を削除
    _removeConnection(parent, child);
}
}