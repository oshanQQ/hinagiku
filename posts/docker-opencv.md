---
title: "Python + DockerでOpen CVを動かせなかった時の対応"
date: "2021-12-15"
---
# はじめに
現在研究室で扱っている機械学習の環境は、Docker(Docker Compose) + Python(JupyterLab)で立てています。その研究を行う中で、学習データとして「通常の画像」と「輪郭のみの画像」の画像セットを用意することになりました。そこで画像処理にOpne CVを使おうとしたのですが、その際の環境構築でつまずいた部分を記録していきます。

# ImportError: libGL.so.1: cannot open shared object file
Python版OpenCV(`opencv-contrib-python`)を入れたはいいものの、`ImportError: libGL.so.1: cannot open shared object fil e: No such file or directory`でエラーを吐きました。ベースイメージのOS(linux/amd64)に`libGL.so`がない、と言われています。したがって、コンテナの中でコマンドを叩いてインストールします。  
まず、OS自体をアップデートします(私はこれを行っておらず、しばらくコマンド自体が通らない状況でした...ちゃんと`update`しようね...)。
```bash
apt-get update
```
アップデートが完了したのち、`apt`を使って`libGL.so`を導入します。
```bash
apt install -y libgl1-mesa-dev
```
以上の操作で、`ImportError`は解決しました🎉

# 参考
## ImportError関係
- [Image Layer Details - continuumio/anaconda3:2021.05 - sha256:41a31481637e1774c798e028cf885b0411d091043b03762f35f62e147c33b3f8 | Docker Hub](https://hub.docker.com/layers/continuumio/anaconda3/2021.05/images/sha256-41a31481637e1774c798e028cf885b0411d091043b03762f35f62e147c33b3f8?context=explore)
- [OpenCVをPythonで動かそうとしてlibGL.soが無いって言われたけど解決した。 - Qiita](https://qiita.com/toshitanian/items/5da24c0c0bd473d514c8)
- [8.2. Debian に慣れる](https://www.debian.org/releases/stable/amd64/ch08s02.ja.html#idm2975)
- [Docker: E: Unable to locate package - Tech Tips](https://sumito.jp/2018/07/30/e-unable-to-locate-package/)
## imshow()関係
