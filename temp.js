const request = require('request');
const iconv = require('iconv-lite');
const charset = require('charset');

let message = encodeURI("감자");
let url = "https://ko.wikipedia.org/wiki/" + message;

request({ uri:url, encoding:null }, (err, res, html) => {
    let output = null;
    let encoding = charset(res.headers, html);
    let regx = new RegExp(/<p>(.*?)<\/p>/);
    let data = iconv.decode(html, encoding);
    data = data.match(regx);
    output = data[0].replace(/<[^>]+>/g, "");
});

console.log(output);