# 環境構築！
1. texclientのパスに移動 (cd ~/texclient > )
2. npm install -g gulp
3. npm install  


# 起動！
1. texclientのパスに移動 (cd ~/texclient > )
2. 下のどっちかのコマンドを使ってね。

* gulp 
  * これで自動デプロイ状態になります。（たぶん画面更新も走るはず）

* gulp mock
  * これで疑似サーバーとAPI通信ができるようになります。（こっち画面更新が走らないので手動で更新してね）
  * mockフォルダ内に*_post.json、*_get.jsonを作成すると、js/util/api.jsのApiClassでAPI通信できるはず。
 ```
  const sampleApi = new ApiClass("ファイル名");
  sampleApi.post().then(
    (res) => {
      console.log("API OK!");
      //成功時の処理
      $scope.$apply(); //画面更新
    },(error) => {
      console.log("API NG!");
      //失敗時の処理
      $scope.$apply(); //画面更新
    }
    ※ js/controller/main.controllerを参考にしてね。
 ```
  