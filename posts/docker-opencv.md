---
title: "Python + DockerでOpen CVを動かせなかった時の対応"
date: "2021-12-15"
---

# はじめに

現在、私は Python(JupyterLab) + Docker(Docker Compose)で機械学習の環境を構築しています。  
この環境のもとで、訓練データとして「通常の画像」と「輪郭画像」の画像セットを用意することになりました。そのために Open CV を使ったのですが、いろいろとハマる部分が多かったので記録しておきます。

# ImportError: libGL.so.1: cannot open shared object file

Python 版 OpenCV(`opencv-contrib-python`)を入れたはいいものの、`ImportError: libGL.so.1: cannot open shared object fil e: No such file or directory`でエラーを吐きました。ベースイメージの OS(linux/amd64)に`libGL.so`がない、と言われています。したがって、コンテナの中でコマンドを叩いてインストールします。

まず、OS 自体をアップデートします。

```bash
apt update
```

アップデートが完了したのち、`apt`を使って`libGL.so`を導入します。

```bash
apt install -y libgl1-mesa-dev
```

以上の操作で、`ImportError`は解決しました 🎉

# JpyterLab だと `imshow()`が使えない

以下のコードで、Jupyter Notebook から画像を表示させようとしました。

```py
import cv2

path = "img/lena.jpg"
img = cv2.imread(path)
cv2.imshow('image', img)

cv2.waitKey(0)
cv2.destroyAllWindows()
```

しかし、このファイルの実行時に以下のメッセージが出力されてうまく動きませんでした。

![](/blog/docker-opencv/docker-opencv1.png)

[こちらの記事](https://stackoverflow.com/questions/58100252/jupyter-kernel-crashes-when-trying-to-display-image-with-opencv)を見てみると、どうも **Open CV の`imshow()`が Jpyter Notebook のセッションを殺す** らしいです。同様の問題を抱えている方もいらっしゃいました。

> matplotlib is a good workaround as it doesn't seem possible to show opencv images inline in a jupyter notebook

> I was having a similar problem, and could not come to a good solution with `cv2.imshow()` in the Jupyter Notebook. I followed this stackoverflow answer, just using matplotlib to display the image.

JupyterLab では`imshow()`は使えないということです。代わりに、`matplotlib`を使うことのがテンプレのようです。

```py
%matplotlib inline

import cv2
from matplotlib import pyplot as plt

path = "img/lena.jpg"
img = cv2.imread(path)
plt.imshow(img)
```

画像もしっかり表示されていますね 🎉  
※色味がおかしいのは後述

![](/blog/docker-opencv/docker-opencv2.png)

# 画像の色味がおかしい

この画像は元の画像より青っぽく表示されています。元の画像がこちら。

![](/blog/docker-opencv/docker-opencv3.png)

これは OpenCV の仕様によるものです。詳しい解説は[こちらの記事](https://tellusxdp.github.io/start-python-with-tellus/lesson8.html)から拝借しました。

> OpenCV で`imread`を使って読み込む場合、既定では、画像を「BGR」（青・緑・赤）の順の配列として読み込みます。対して、表示するための`matplotlib.imshow()`では、画像が「RGB」（赤・緑・青）の順の配列として構成されていることを前提としています。そのため、このまま表示すると、青と赤が入れ替わってしまうため、先に表示したように色がおかしくなってしまうのです。

こちらの画像も青と赤が反転しています。したがって、表示する前に`cvtColor()`で「BGR」から「RGB」に変換します。

```py
img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
```

また、エッジ検出画像を`plt.imshow()`で表示するときも青っぽくなりますので、以下のように`cmap`を指定します。

```py
plt.imshow(img_canny, cmap="gray")
```

最終的に、以下のコードに落ち着きました。

```py
import cv2
import matplotlib.pyplot as plt
%matplotlib inline

path = "img/lena.jpg"
img = cv2.imread(path)

# BGR -> RGB に変換
img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

# エッジ検出
img_canny = cv2.Canny(img, 130, 220)

# cmap: グレースケールでエッジ画像を表示
plt.imshow(img_canny, cmap="gray")

# エッジ画像を保存
cv2.imwrite("lena_canny.png", img_canny)
```

ちゃんと境界画像も生成できています！これで学習データを作れる～ 🎉🎉

![](/blog/docker-opencv/docker-opencv4.png)

# 参考

### ImportError 関係

- [Image Layer Details - continuumio/anaconda3:2021.05 | Docker Hub](https://hub.docker.com/layers/continuumio/anaconda3/2021.05/images/sha256-41a31481637e1774c798e028cf885b0411d091043b03762f35f62e147c33b3f8?context=explore)
- [OpenCV を Python で動かそうとして libGL.so が無いって言われたけど解決した。 - Qiita](https://qiita.com/toshitanian/items/5da24c0c0bd473d514c8)
- [8.2. Debian に慣れる](https://www.debian.org/releases/stable/amd64/ch08s02.ja.html#idm2975)
- [Docker: E: Unable to locate package - Tech Tips](https://sumito.jp/2018/07/30/e-unable-to-locate-package/)

### imshow()関係

- [python - opencv.imshow will cause jupyter notebook crash - Stack Overflow](https://stackoverflow.com/questions/46236180/opencv-imshow-will-cause-jupyter-notebook-crash)

### 色関係

- [OpenCV の使い方 | Tellus](https://tellusxdp.github.io/start-python-with-tellus/lesson8.html)
