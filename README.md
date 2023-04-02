# vert-sns
vert-snsは、TruffleとGanacheを使用して開発された、縦型SNSのスマートコントラクトリポジトリです。このREADMEでは、ローカル環境でのセットアップと実行方法について説明します。

## 前提条件
このプロジェクトを実行するには、以下のソフトウェアがインストールされている必要があります。

- Node.js (v12.x 以上)
- npm (v6.x 以上)
- Truffle (v5.x 以上)
- Ganache

## セットアップ
このリポジトリをクローンします。
```bash
git clone https://github.com/your_username/vert-sns.git
```
プロジェクトディレクトリに移動し、必要なパッケージをインストールします。
```bash
cd vert-sns
npm install
```
Ganacheを起動して、ローカルのEthereumネットワークを立ち上げます。GanacheのGUIまたはCLIを使用することができます。CLIを使用する場合、以下のコマンドを実行します。
```bash
ganache-cli
```
Truffleを使用して、スマートコントラクトをコンパイルし、ローカルのEthereumネットワークにデプロイします。
```bash
truffle compile
truffle migrate
```
オプションで、テストを実行することができます。テストを実行するには、以下のコマンドを実行します。
```bash

truffle test
```
## 使用方法
プロジェクトをセットアップした後、Truffleのコンソールを使ってスマートコントラクトと対話することができます。

```bash

truffle console
```

コンソール内で、コントラクトインスタンスを取得し、関数を呼び出すことができます。例えば、新しいユーザーを登録するには、以下のようにします。

```bash
let instance = await VerticalSNS.deployed()
await instance.registerUser(web3.utils.asciiToHex('your_unique_id'))
```
コントラクトの他の関数も同様に呼び出すことができます。

## License
このプロジェクトは、ISCライセンスの下で配布されています。

## 例）
### 親を追加する
```javascript

let treeId = web3.utils.asciiToHex('tree_id')
let parentAddress = '0x123...parent_address_here...'
await instance.addParent(treeId, parentAddress)
```
### ユーザーの親と子を取得する
```javascript

let userAddress = '0x123...user_address_here...'
let connection = await instance.getConnection(userAddress, treeId)
console.log('Parents:', connection.parent)
console.log('Children:', connection.children)
```
### 親子関係を削除する
```javascript

let parentAddress = '0x123...parent_address_here...'
let childAddress = '0x123...child_address_here...'
await instance.removeConnection(parentAddress, childAddress)
```
### 親子関係を確認する
```javascript

let isConnected = await instance.isConnected(parentAddress, childAddress)
console.log('Is connected:', isConnected)
```
### 子から親子関係を削除する
```javascript

await instance.removeConnectionFromChild(parentAddress)
```

Truffleコンソールを終了するには、exitコマンドを入力してください。

