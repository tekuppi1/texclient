// INCLUDE
let request = require('superagent');

/**
 * @class API通信クラス
 * @param {String} path - root以下のパス
 */
export default class ApiClass{

  /**
   * コンストラクタ
   * @param {String} path - root以下のパス
   */
  constructor(path = null){
    console.log("ApiClass.constructor START");
    if(!path) console.log("apiパスが不足しています");
    this.path = 'mock/' + path; //モックにpath通し
  }

  /**
   * POSTを行うメソッド
   * @param {Object} send - リクエストパラメータ
   * @return {Object} resolve - レスポンスデータ
   * @return {Object} reject - エラーオブジェクト
   */
  post(send = null){
    console.log("ApiClass.post START");
    if( !window.JSON ) return null;
    return new Promise((resolve, reject) => {
      request.post(this.path).send(send).end(
        (err, res) => { res.ok ? resolve(this.res(res)) : reject(this.rej(err))}
      )
    });
  }

  /**
   * GETを行うメソッド
   * @param {Object} send - リクエストパラメータ
   * @return {Object} resolve - レスポンスデータ
   * @throws {Object} reject - エラーオブジェクト
   */
  get(send = null){
    console.log("ApiClass.get START");
    if( !window.JSON ) return null;
    return new Promise((resolve, reject) => {
      request.get(this.path).send(send).end(
        (err, res) => { res.ok ? resolve(this.res(res)) : reject(this.rej(err))}
      )
    });
  }

  /**
   * resolveのラップ
   * @returns {Object} レスポンス
   */
  res(res){
    console.log('success');
    return res.body;
  }

  /**
   * resolveのラップ
   * @returns {Object} エラー
   */
  rej(err){
    console.log('error');
    return err;
  }

}
