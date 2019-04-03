var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.set("view engine","ejs");
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
let list=[
    {
        logo: '/images/icon_my.png',
        title: '好吃的大包子！',
        desc: '今年新品，等你品尝',
        num: 345,
        price: '13',
        promotion: '买3个送1个'
    },
    {
        logo: '/images/icon_first.png',
        title: '好吃的大包子！',
        desc: '今年新品，等你品尝',
        num: 345,
        price: '13',
        promotion: '买3个送1个'
    }
]
app.get('/list', function (req, res) {
    res.send(JSON.stringify(list));
})

var server = app.listen(8888, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})