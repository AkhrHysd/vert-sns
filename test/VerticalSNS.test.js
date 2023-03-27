const VerticalSNS = artifacts.require("VerticalSNS");

contract("VerticalSNS", (accounts) => {
  let instance;

  beforeEach(async () => {
    instance = await VerticalSNS.deployed();
  });

  contract("registerUser", () => {

    it("ユーザーをユニークIDで登録できること", async () => {
      const uniqueId = "user1";
      const hexUniqueId = web3.utils.asciiToHex(uniqueId).padEnd(66, '0');
      await instance.registerUser(hexUniqueId, { from: accounts[0] });
  
      const storedUniqueId = await instance.getUserUniqueId(accounts[0]);
      assert.equal(
        storedUniqueId,
        hexUniqueId,
        "uniqueId was not set correctly"
      );
    });


    it.skip("ユーザーがすでに登録されている場合はエラーを返すこと", async () => {
        const uniqueId = "user1";
        const hexUniqueId = web3.utils.asciiToHex(uniqueId).padEnd(66, '0');
        await instance.registerUser(hexUniqueId, { from: accounts[0] });
      
        try {
          await instance.registerUser(hexUniqueId, { from: accounts[0] });
          assert.fail("Expected error but none was thrown");
        } catch (error) {
          assert(error.reason === "User already registered", "Unexpected error was thrown");
        }
      });
  })

  contract("getUserUniqueId", () => {
    it('ユーザーアドレスからユニークIDを得られること', async () => {
        const uniqueId = "user1";
        const hexUniqueId = web3.utils.asciiToHex(uniqueId).padEnd(66, '0');
        await instance.registerUser(hexUniqueId, { from: accounts[0] });

        const storedUniqueId = await instance.getUserUniqueId(accounts[0]);


      assert.equal(
        storedUniqueId,
        hexUniqueId,
        "uniqueId was not set correctly"
      );

    })
  })

  contract("addParent", () => {
    it('特定のtreeに親を追加できること', async () => {
        const parentUniqueId = "parent";
        const childUniqueId = "child";
        const hexParentUniqueId = web3.utils.asciiToHex(parentUniqueId).padEnd(66, '0');
        const hexChildUniqueId = web3.utils.asciiToHex(childUniqueId).padEnd(66, '0');
        const treeId = web3.utils.asciiToHex("tree1").padEnd(66, '0');
    
        await instance.registerUser(hexParentUniqueId, { from: accounts[0] });
        await instance.registerUser(hexChildUniqueId, { from: accounts[1] });
    
        await instance.addParent(treeId, accounts[0], { from: accounts[1] });
    
        // 親子関係をチェックする
        const { parent: parents, children } = await instance.getConnection(accounts[1], treeId);
        assert.equal(parents[0], accounts[0], "Parent was not added correctly");    
    })

    it.skip('すでに親子関係が成立している場合はエラーを返すこと', async () => {
        const parentUniqueId = "parent";
        const childUniqueId = "child";
        const hexParentUniqueId = web3.utils.asciiToHex(parentUniqueId).padEnd(66, '0');
        const hexChildUniqueId = web3.utils.asciiToHex(childUniqueId).padEnd(66, '0');
        const treeId = web3.utils.asciiToHex("tree1").padEnd(66, '0');
    
        await instance.registerUser(hexParentUniqueId, { from: accounts[0] });
        await instance.registerUser(hexChildUniqueId, { from: accounts[1] });
    
        await instance.addParent(treeId, accounts[0], { from: accounts[1] });

        try{
            // 再度実行
            await instance.addParent(treeId, accounts[0], { from: accounts[1] });
        } catch(err) {
            assert(error.reason === "User already registered", "Unexpected error was thrown");
        }
       
    })

    it.skip('ユーザーが登録されていなかったらエラーを返すこと', async () => {
        const parentUniqueId = "parent";
        const hexParentUniqueId = web3.utils.asciiToHex(parentUniqueId).padEnd(66, '0');
        const treeId = web3.utils.asciiToHex("tree1").padEnd(66, '0');
    
        await instance.registerUser(hexParentUniqueId, { from: accounts[0] });
    
        try {
        await instance.addParent(treeId, accounts[0], { from: accounts[1] });
        } catch (err) {
            assert(error.reason === "User not registered", "Unexpected error was thrown");
        } 
    })

    it.skip('親がいない場合にエラーを返すこと', async () => {
        const childUniqueId = "child";
        const hexChildUniqueId = web3.utils.asciiToHex(childUniqueId).padEnd(66, '0');
        const treeId = web3.utils.asciiToHex("tree1").padEnd(66, '0');
    
        await instance.registerUser(hexChildUniqueId, { from: accounts[1] });
    
        try {
        await instance.addParent(treeId, accounts[0], { from: accounts[1] });
        } catch (err) {
            assert(error.reason === "User not registered", "Unexpected error was thrown");
        } 
    })
  })

  contract("getConnection", () => {
    it("ユーザーが親ノードとのコネクションを取得できること", async () => {
      const parentUniqueId = "parent";
      const childUniqueId = "child";
      const hexParentUniqueId = web3.utils.asciiToHex(parentUniqueId).padEnd(66, "0");
      const hexChildUniqueId = web3.utils.asciiToHex(childUniqueId).padEnd(66, "0");

      await instance.registerUser(hexParentUniqueId, { from: accounts[0] });
      await instance.registerUser(hexChildUniqueId, { from: accounts[1] });
      await instance.addParent(hexChildUniqueId, hexParentUniqueId, { from: accounts[1] });

      const connection = await instance.getConnection(hexChildUniqueId);
      assert.equal(connection, hexParentUniqueId, "Parent connection was not retrieved correctly");
    });
  });

  contract('removeConnection')

  contract('findChilIndex')

  contract('findParentIndex')

  contract('isConnected')

  contract('_removeConnection')

  contract('removeConnectionFromChild')

});