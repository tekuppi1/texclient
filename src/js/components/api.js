//TODO: superAgentの実装
var request = require('superagent');

exports.RequestAPI = () => {
  console.log("RequestAPI START");
  request
    .post('mock/sample.json')
    .send({
      hoge: "fugefuge"})
    .end(function(err, res){
      if (res.ok) {
        console.info(res.body);
        console.log('success');
      } else {
        console.error('error');
      }
      console.log('complete');
    });
}