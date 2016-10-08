/**
 * 本管理クラス
 * @param {string} title - タイトル
 * @param {string} author - 著者
 * @param {string} price - 値段
 * @param {string} img - 画像URL
 */
export default class Book{

  /**
   * コンストラクタ
   * @param {Object} data - 本のオブジェクト
   */
  constructor(data={}){
    if(!data) console.log("Book read error");
    this.title  = data.title  || "";
    this.author = data.author || "";
    this.price  = data.price  || "";
    this.img    = data.img    || "";
  }

  /**
   * 本のsetter
   * @param {Object} data - 本のオブジェクト
   */
  set(data=null){
    if(!data){
      console.log("Book set error");
      return;
    }
    this.title  = data.title  || this.title;
    this.author = data.author || this.author;
    this.price  = data.price  || this.price;
    this.img    = data.img    || this.img;
  }

  /**
   * 本のgetter
   * @return {Object} 本のオブジェクト
   */
  get(){
    return {
      title:   this.title,
      author:  this.author,
      price:   this.price,
      img:     this.img,
    }
  }

}
