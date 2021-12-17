---
title: "Python + DockerでOpen CVを動かせなかった時の対応"
date: "2021-12-15"
---

# はじめに

現在研究室で扱っている機械学習の環境は、Python(JupyterLab) + Docker(Docker Compose)で立てています。その研究を行う中で、学習データとして「通常の画像」と「輪郭のみの画像」の画像セットを用意することになりました。そこで画像処理にOpne CVを使おうとしたのですが、いろいろハマったので記録していきます。

※OpenCVの操作方法を詳しく説明することはしません。そこは自分でググって～。

# ImportError: libGL.so.1: cannot open shared object file

Python版OpenCV(`opencv-contrib-python`)を入れたはいいものの、`ImportError: libGL.so.1: cannot open shared object fil e: No such file or directory`でエラーを吐きました。ベースイメージのOS(linux/amd64)に`libGL.so`がない、と言われています。したがって、コンテナの中でコマンドを叩いてインストールします。  

まず、OS自体をアップデートします(私はこれを忘れていてしばらくハマりました...ちゃんと`update`しようね...)。

```bash
apt update
```

アップデートが完了したのち、`apt`を使って`libGL.so`を導入します。

```bash
apt install -y libgl1-mesa-dev
```

以上の操作で、`ImportError`は解決しました🎉

# JpyterLabだとimshow()が使えない

以下のコードで、Jupyter Notebookから画像を表示させようとしました。

```py
import cv2

path = "img/lena.jpg"
img = cv2.imread(path)
cv2.imshow('image', img)
 
cv2.waitKey(0)
cv2.destroyAllWindows()
```

しかし、このファイルの実行時に以下のメッセージが出力されてうまく動きませんでした。
  
![](docker-opencv1.png)
  
[こちらの記事](https://stackoverflow.com/questions/58100252/jupyter-kernel-crashes-when-trying-to-display-image-with-opencv)を見てみると、どうも **Open CVの`imshow()`がJpyter Notebookのセッションを殺す** らしいです。同様の問題を抱えている方もいらっしゃいました。

> matplotlib is a good workaround as it doesn't seem possible to show opencv images inline in a jupyter notebook
  
> I was having a similar problem, and could not come to a good solution with `cv2.imshow()` in the Jupyter Notebook. I followed this stackoverflow answer, just using matplotlib to display the image.

JupyterLabでは`imshow()`は使えないということです。代わりに、`matplotlib`を使うことのがテンプレのようです。

```py
%matplotlib inline

import cv2
from matplotlib import pyplot as plt

path = "img/lena.jpg"
img = cv2.imread(path)
plt.imshow(img)
```

画像もしっかり表示されていますね🎉  
※色味がおかしいのは後述

![](docker-opencv2.png)

# 画像の色味がおかしい
うまく画像を表示している感を出しましたが、この画像は元の画像より青っぽく表示されています。元の画像がこちら。

![](docker-opencv3.png)

これはOpenCVの使用によるものです。詳しい解説は[こちらの記事](https://tellusxdp.github.io/start-python-with-tellus/lesson8.html)から拝借しました。

> OpenCVで`imread`を使って読み込む場合、既定では、画像を「BGR」（青・緑・赤）の順の配列として読み込みます。対して、表示するための`matplotlib.imshow()`では、画像が「RGB」（赤・緑・青）の順の配列として構成されていることを前提としています。そのため、このまま表示すると、青と赤が入れ替わってしまうため、先に表示したように色がおかしくなってしまうのです。

例に漏れず、こちらの画像も青と赤が反転しています。したがって、表示する前に`cvtColor()`で「BGR」から「RGB」に変換します。

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

ちゃんと境界画像も生成できています！これで学習データを作れる～🎉🎉

![](docker-opencv4.png)

# 参考
## ImportError関係
- [Image Layer Details - continuumio/anaconda3:2021.05 - sha256:41a31481637e1774c798e028cf885b0411d091043b03762f35f62e147c33b3f8 | Docker Hub](https://hub.docker.com/layers/continuumio/anaconda3/2021.05/images/sha256-41a31481637e1774c798e028cf885b0411d091043b03762f35f62e147c33b3f8?context=explore)
- [OpenCVをPythonで動かそうとしてlibGL.soが無いって言われたけど解決した。 - Qiita](https://qiita.com/toshitanian/items/5da24c0c0bd473d514c8)
- [8.2. Debian に慣れる](https://www.debian.org/releases/stable/amd64/ch08s02.ja.html#idm2975)
- [Docker: E: Unable to locate package - Tech Tips](https://sumito.jp/2018/07/30/e-unable-to-locate-package/)
## imshow()関係
- [python - opencv.imshow will cause jupyter notebook crash - Stack Overflow](https://stackoverflow.com/questions/46236180/opencv-imshow-will-cause-jupyter-notebook-crash)
## 色関係
- [OpenCVの使い方 | Tellus](https://tellusxdp.github.io/start-python-with-tellus/lesson8.html)