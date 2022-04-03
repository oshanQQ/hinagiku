---
title: "Cloud Functionsで使う環境変数をGitHub Actionsから設定する"
date: "2022-04-03"
---

# はじめに

最近、GitHub Actions を使って Cloud Functions へのデプロイを自動化しました。その際、Cloud Functions で使う環境変数も GitHub Actions から設定しました。この情報がネットで検索してもほぼ出てこなかったので、備忘録という形で紹介したいと思います。

# Cloud Functions における環境変数

Cloud Functions において、環境変数の設定方法は主に 2 つあります。1 つ目は`.env`に環境変数を記述し、まるごとデプロイする方法。2 つ目は`firebase-tools`からコマンドを叩いて設定する方法です。

### `.env`をまるごとデプロイ

`functions`ディレクトリ直下に`.env`ファイルを作成し、そこに環境変数を記述します。

```.env
PLANET=Earth
```

すると、Node.js 環境下では`dotenv`経由で環境変数を参照できます。

```js
console.log(`Hello ${process.env.PLANET}`);
// "Hello Earth and Humans"
```

しかし、一般的に環境変数に設定する値はデータベースの認証情報や API キーなどの機密性の高い情報です。そのような情報を平文の状態で記述してデプロイするというやり方は、あまり安全ではありません。GitHub で管理するならなおさらです。そこで、Cloud Functions では CLI ツールから環境変数を設定する方法が提供されています。

### Firebase CLI を利用する

Firebase CLI は開発環境にインストールされている前提で進めます。環境変数を設定したい Firebase プロジェクトに移動し、以下のコマンドを叩きます。

```bash
$ firebase functions:secrets:set info.PLANET="Earth"
```

すると、Node.js 環境下では以下のように環境変数を参照できます。

```js
const functions = require("firebase-functions");

console.log(`Hello ${functions.config().info.PLANET}`);
// "Hello Earth"
```

環境変数設定の操作は、一般的に開発環境から手打ちで行うようです。しかし人間の手で操作するというのは思いがけないミスの元です。そこで、今回の本題である GitHub Actions での自動化を行おうと思います。
