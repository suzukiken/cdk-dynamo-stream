+++
title = "Dynamo DBのStreamをLambdaで処理する"
date = "2021-03-23"
tags = ["Dynamo DB", "Lambda"]
+++

[Githubのリポジトリ](https://github.com/suzukiken/cdkdynamo-stream)

Dynamo DBのStreamをLambdaが取り込んで何かの処理をするという仕組みを作ってみた。

それは以上。ということなのだが、AWSのドキュメントを見ていたら結構注意点があることに気がついた。

注意点として特に自分が気にしたいと思ったのはこれら。

* 冪等性
* バッチの部分的な成功・失敗
* 失敗の通知方法
* 再試行回数の制限

で、だから何ということでもないし、こうした注意点が今回のサンプルコードに考慮されているわけではないし、今後開発で利用するときに注意しないといけないなあというだけなのだが、ともかく参考となるページや引用をメモ代わりにここに残しておくことにする。

参考になったページ：

* https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/Streams.html
* https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/with-ddb.html
* https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/Streams.Lambda.BestPracticesWithDynamoDB.html

抜粋：

> DynamoDB table and stores this information in a log for up to 24 hours. 

> Lambda は、レコードの DynamoDB ストリームにあるシャードを 1 秒あたり 4 回の基本レートでポーリングします。

> 関数がエラーを返した場合、処理が成功するか、データの有効期限が切れるまで Lambda はバッチを再試行します。

> 破棄されたイベントを保持するには、失敗したバッチの詳細を SQS キューまたは SNS トピックに送信するよう、イベントソースマッピングを設定できます。

> Retry attempts (再試行数) – 関数がエラーを返すまでに Lambda が試みる再試行

> ストリームからのバッチの処理中に部分的な成功を許可するには、ReportBatchItemFailuresをオンにします 。

> 部分的な成功を許可すると、レコードの再試行回数を減らすことができますが、成功したレコードの再試行の可能性を完全に妨げるわけではありません。

