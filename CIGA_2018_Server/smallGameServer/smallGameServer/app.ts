#!/usr/bin/env node
const http = require('http');
const https = require('https');
const ws = require("nodejs-websocket");

//数据
var baseStruct = { opt: 'base', data: { type: 1, str: 'test text' } };
//用户表
var allUser = {};
var onlineUser = {};

// 客户端
var gameClient = {
    conn: null,
};

// 在线玩家
var onlineControllers = {};

// 离线玩家
var offlineControllers = {};

// 从控制器发给游戏
function Controller2client(o) {
    if (gameClient.conn)
        gameClient.conn.sendText(JSON.stringify(o));
}

// 广播给所有控制器
function broadcastController(o) {
    var msg = JSON.stringify(o);
    for (var _k in onlineControllers) {
        if (onlineControllers[_k].conn)
            onlineControllers[_k].conn.sendText(msg);
    }
}


function CreatePlayer() {
    return {
        keyid:0,
        socket: null,
        weixinid:null,
        name: null,
        conn:null,
        score: 0,
    };
}




// 比较两个描述符是否相同
function compareSocket(s1, s2) {
    return (s1.remoteAddress == s2.remoteAddress && s1.remotePort == s2.remotePort);
}

var server = ws.createServer(function (conn) {
    conn.on("text", function (str) {
        console.log("收到的信息为:" + str);
        try {
            var context = JSON.parse(str);
        }
        catch (e) {
            console.error(e);
            return;
        }

        console.log('!-- context.opt');
        switch (context.opt) {
            case 'hello':
                baseStruct.opt = 'on_hello';
                baseStruct.data.str = '你好啊!';
                baseStruct.data.type = 1;
                var needSend = JSON.stringify(baseStruct);
                this.sendText(needSend);
                break;
            case "client_login":
                gameClient.conn = this;
                break;
            case "controller_login":
                break;
        }

    })
    conn.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭")
    });
}).listen(8003)

console.log("服务器正正常启动:8003");


// 微信验证
// APPID 小程序APPID
// SECRET 小程序 appSecret
// js_code 登录时获取的 cod
// grant_type 填写为 authorization_code
// 返回值请参考 https://developers.weixin.qq.com/minigame/dev/document/open-api/login/code2accessToken.html
//function code2accessToken(APPID, SECRET, JSCODE, authorization_code) {
//    https.get('https://api.weixin.qq.com/sns/jscode2session?appid='+APPID+'&secret='+SECRET+'&js_code='+JSCODE+'&grant_type='+authorization_code, (res) => {
//        console.log('statusCode:', res.statusCode);
//        console.log('headers:', res.headers);
//        res.on('data', (d) => {
//            process.stdout.write(d);
//        });

//    }).on('error', (e) => {
//        console.error(e);
//        });
//}

//}).on('error', (e) => {
//    console.error(e);
//    });

//const options = {
//    hostname: 'encrypted.google.com',
//    port: 443,
//    path: '/',
//    method: 'GET',
//    key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
//    cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem'),
//    agent: false
//};

//const req = https.request(options, (res) => {
//    // ...
//});