const express = require('express');
const request = require('request');
const iconv = require('iconv-lite');
const charset = require('charset');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/send', function(req, res, next) {
    let token = req.body.token;
    if(token === "811ce982066ab307a87e1eba77662152") {
        console.log("Hello Irin!!");
        let data = req.body.text;
        data = data.replace('/레아 ', '').split(' ');
        switch (data[0]) {
            case "뽑기":
                randomChoice(data);
                break;
            case "검색":
                getWiki(data[1]);
                break;
            default:
                break;
        };
    }
});

function randomChoice(data) {
    let message = "";
    let random = Math.floor(Math.random() * (data.length - 1)) + 1;
    sendMessage(data[random] + "님께서 당첨 되셨습니다!!");
}

function sendMessage(message) {
    let options = {
        url: 'https://wh.jandi.com/connect-api/webhook/11355771/7d9ec41fb37af6704ee8b5f0b6a8d04f',
        method: 'POST',
        headers: {
            'Accept': 'application/vnd.tosslab.jandi-v2+json',
            'Content-Type': 'application/json'
        },
        form: {
            body: message
        }
    };
    request(options, function(err, res, html) {
        if(err) {
            console.log(err);
            return;
        }
        // console.log("received server data:" + html);
    });
}

function getWiki(message) {
    let url = "https://ko.wikipedia.org/wiki/" + encodeURI(message);
    let output = null;
    request({ uri:url, encoding:null }, (err, res, html) => {
        let encoding = charset(res.headers, html);
        let regx = new RegExp(/<p>(.*?)<\/p>/);
        let data = iconv.decode(html, encoding);
        data = data.match(regx);
        sendMessage(data[0].replace(/<[^>]+>/g, ""));
    });
}

module.exports = router;
