---
title: "Rustでシェルを自作してみた"
date: "2021-09-02"
---

# はじめに

今回、Rust やシステムプログラミングの練習を兼ねて、シェルを Rust で実装しました。この記事では、その際の解説やポイントなどを書いていきたいと思います。

# シェル概要

今回実装するシェルは**coconush🥥**と名付けました。錆(Rust)は基本的に茶色い見た目をしています。そんな Rust で、カーネルを守る貝殻(シェル)を実装するので、同じく「茶色の見た目で、何かを覆うもの」としてココナッツから名前を取りました。 ~~ahi~~ GitHub のリポジトリと Zenn のスクラップを載せておきます。

[oshanQQ/coconush: 🥥 A toy shell implemented in Rust](https://github.com/oshanQQ/coconush)

[自作シェルを Rust で実装するときのメモ](https://zenn.dev/oshanqq/scraps/9af8e5c9fa054c)

# 実装

coconush の内部実装は、

- コマンドラインから入力を受け取る。
- 入力をパースする
- プロセスを fork する。
- 親プロセスでは、子プロセスが終了するまで待機する。
- 子プロセスではコマンドを実行する。実行が完了したら子プロセスは終了する。

の無限ループです。Rust では、システムコールを叩く手段として標準クレートと`nix`というクレートが使えます。今回は簡潔に書くことができる`std::Command()`を使っていきます。こちらが、coconush の`main()`部分です。

```rust
mod prompt;
use std::env;
use std::io::{stdin, stdout, Write};
use std::path::Path;
use std::process::Command;

fn main() {
    loop {
        // display status
        if let Err(e) = prompt::display_prompt() {
            eprintln!("prompt error: {}", e);
        }
        if let Err(e) = stdout().flush() {
            eprintln!("buf error: {}", e);
        }

        // input line
        let mut line = String::new();
        if let Err(e) = stdin().read_line(&mut line) {
            eprintln!("read line error: {}", e);
        }

        // parse input
        let mut parts = line.trim().split_whitespace();
        let command = parts.next().unwrap_or("\n");
        let args = parts;

        // exec command
        match command {
            "cd" => {
                let new_dir = args.peekable().peek().map_or("/", |x| *x);
                let root = Path::new(new_dir);
                if let Err(e) = env::set_current_dir(&root) {
                    eprintln!("cd error: {}", e);
                }
            },
            "exit" => return,
            command => match Command::new(command).args(args).spawn() {
                Ok(mut child) => {
                    if let Err(e) = child.wait() {
                        eprintln!("wait error: {}", e);
                    }
                }
                Err(e) => {
                    eprintln!("exec error: {}", e);
                }
            },
        }
    }
}

```

まずは、プロンプトを表示させる部分です。

```rust
// display status
if let Err(e) = prompt::display_prompt() {
    eprintln!("prompt error: {}", e);
}
if let Err(e) = stdout().flush() {
    eprintln!("buf error: {}", e);
}
```

`display_prompt()`関数は、`prompt.rs`モジュールで定義しています。

```rust
// prompt.rs
use colored::*;
use std::env;
use std::io::Result;
use whoami::{hostname, username};

pub fn display_prompt() -> Result<()> {
    let current_path = env::current_dir()?;
    print!(
        "{}{}{}:{}{}",
        username().green().truecolor(222, 165, 132).bold(),
        "@".truecolor(222, 165, 132).bold(),
        hostname().truecolor(222, 165, 132).bold(),
        current_path.display(),
        ">".truecolor(222, 165, 132).bold()
    );
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn get_current_directory() {
        assert!(display_prompt().is_ok());
    }
}
```

やってることは、

- 実行環境の`username`, `hostname`, カレントディレクトリのパスを取得して表示
- 関数には`Result`を返させている
- 関数が`Ok()`を返すかどうかのテスト

です。`Result`を返させることで関数の呼び出し元でエラーハンドリングできる他、テストも可能です。

`main()`内(関数の呼び出し元)では「`Ok()`のときにはそのまま実行(値を返したりはしない)して、`Err()`のときにはエラーメッセージを返す」という処理を書いています。さらに`if let`文を使うことで、`match`よりも簡潔に書くことができます。以前`match`で書いていたときは、記述量が多くなって冗長でした。ここら辺は上手く省略できたかなと思っています。

またプロンプトを表示させた状態で入力を受けつけたいので、ラインバッファを`flush()`で解放してあげています。

次に、入力を受け取る部分です。

```rust
// input line
let mut line = String::new();
if let Err(e) = stdin().read_line(&mut line) {
    eprintln!("read line error: {}", e);
}

// parse input
let mut parts = line.trim().split_whitespace();
let command = parts.next().unwrap_or("\n");
let args = parts;
```

前半部分では普通に入力を受け取っています。後半の部分では、コマンド部分とオプション部分をそれぞれ`command`変数と`args`変数に入れています。これらを、次のコマンド実行部分に渡していきます。

```rust
// exec command
match command {
    "cd" => {
        let new_dir = args.peekable().peek().map_or("/", |x| *x);
        let root = Path::new(new_dir);
        if let Err(e) = env::set_current_dir(&root) {
            eprintln!("cd error: {}", e);
        }
    },
    "exit" => return,
    command => match Command::new(command).args(args).spawn() {
        Ok(mut child) => {
            if let Err(e) = child.wait() {
                eprintln!("wait error: {}", e);
            }
        }
        Err(e) => {
            eprintln!("exec error: {}", e);
        }
    },
}
```

`cd`コマンドは、`fork`したプロセスを`exec`で変えるという流れで実行できないため、ビルトインコマンドとして定義しています。具体的には、`cd`のみの場合はホームディレクトリ(`/`)に移動し、それ以外は指定されたディレクトリに移動するというものです。つまり、普通の`cd`コマンドです。Rust のコード上では、`cd`という単語の次の単語への参照を`peekable().peek()`で取得し、`map_or()`内のクロージャで参照外しを行っています。

`exit`コマンドは、シェルプログラムそのものを終了するコマンドになっています。

それ以外のコマンドは、基本的に`std::Command()`に渡して実行できます。ただ、子プロセスをフォークした時に子プロセスが死ぬまで親プロセス側は待機しておく必要があります。そのため、`Ok()`だった場合に`wait()`関数を実行しています。

coconush では、以上の処理を`loop()`でループさせています。こうすることで、シェルの動作を再現する事ができます。

# 終わりに

比較的少ないコード量でシステムプログラミングの入門ができるという点から、シェル自作は初学者にかなりおススメできると思っています。Rust に関しても、`unwrap()`で甘えずにエラーハンドリングができているのではないでしょうか。  
coconush にはまだパイプなどは実装されていないので、気が向いたら実装するかもしれません。そのときはまた記事にするので、そのときはよろしくお願いします。

# 参考

- [Build Your Own Shell using Rust | Josh Mcguigan - The things I write](https://www.joshmcguigan.com/blog/build-your-own-shell-rust/)
