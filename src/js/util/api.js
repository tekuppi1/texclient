//TODO: superAgentの実装
let request = require('superagent');

/**
 * API通信を行うメソッド
 * @parms {String} path - root以下のパス
 * @parms {Object} send - リクエストパラメータ
 * @parms {func}   callback(res) - コールバック関数
 * //return {Object} - レスポンスデータ(jsonからObjectに変換) | error時はnull
 */
exports.RequestAPI = (path,send = null) => {
  console.log("RequestAPI START");
  if( !window.JSON ) return null;
  return new Promise((resolve, reject) => {
    request
      .get('mock/' + path)
      .send(send)
      .end(
        (err, res) => {
          if (res.ok) {
            console.log('success');
            //return res.body;
            resolve(res.body);
          } else {
            console.error('error');
            reject(err);
          }
        }
      )
    }
  );
}
