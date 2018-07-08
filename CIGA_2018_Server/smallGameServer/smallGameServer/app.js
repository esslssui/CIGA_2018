#!/usr/bin/env node
var http = require('http');
var https = require('https');
var ws = require("nodejs-websocket");
// //数据
// var baseStruct = { opt: 'base', data: { type: 1, str: 'test text' } };
// //用户表
// var allUser = {};
// var onlineUser = {};
// // 客户端
// var gameClient = {
//     conn: null,
// };
// // 在线玩家
// var onlineControllers = {};
// // 离线玩家
// var offlineControllers = {};
// // 房间内玩家
// var onRoomControllers = {};

// /*
// *  从控制器发给游戏
// *  opt:协议名 data:发送的数据
// */
// function Controller2client(opt, data) {
//     if (gameClient.conn) {
//         var o = {
//             opt: opt,
//             data: data
//         }
//         gameClient.conn.sendText(JSON.stringify(o));
//     }
// }
// /*
// *  广播给所有控制器
// *  opt:协议名 data:发送的数据
// */
// function broadcastController(opt, data) {
//     var o = {
//         opt: opt,
//         data: data
//     }
//     var msg = JSON.stringify(o);
//     for (var _k in onlineControllers) {
//         if (onlineControllers[_k].conn)
//             onlineControllers[_k].conn.sendText(msg);
//     }
// }
// function CreatePlayer() {
//     return {
//         keyid: 0,
//         socket: null,
//         weixinid: null,
//         name: null,
//         conn: null,
//         score: 0,
//     };
// }
// // 比较两个描述符是否相同
// function compareSocket(s1, s2) {
//     return (s1.remoteAddress == s2.remoteAddress && s1.remotePort == s2.remotePort);
// }
// var server = ws.createServer(function (conn) {
//     conn.on("text", function (str) {
//         console.log("收到的信息为:" + str);
//         try {
//             var context = JSON.parse(str);
//         }
//         catch (e) {
//             console.error(e);
//             return;
//         }
//         console.log('!-- context.opt');
//         switch (context.opt) {
//             /*
//             *  测试用
//             */
//             case 'hello':
//                 baseStruct.opt = 'on_hello';
//                 baseStruct.data.str = '你好啊!';
//                 baseStruct.data.type = 1;
//                 var needSend = JSON.stringify(baseStruct);
//                 this.sendText(needSend);
//                 break;
//             /*
//             *  主程序登录
//             */
//             case "client_login":
//                 gameClient.conn = this;
//                 // //判断房间内是否已有玩家，同步玩家信息
//                 // if (Object.keys(onRoomControllers).length !== 0) {

//                 // }
//                 break;
//             /*
//             *  玩家登录
//             *  给玩家分配一个唯一ID标识做属性名，重连和判断在线的时候用
//             */
//             case "controller_login":
//                 var data = context.data;//
//                 if (!data) {  //玩家第一次连接,存入对象
//                     var key = Object.keys(onlineControllers).length.toString();
//                     onlineControllers[key] = {}
//                     onlineControllers[key].id = parseInt(key);
//                     onlineControllers[key].conn = this;
//                 }
//                 // else {
//                 //     //判断是否在房间内，有的话是重连，需同步信息
//                 //     if (onRoomControllers.hasOwnProperty(data.id.toString())) {

//                 //     }
//                 // }
//                 break;
//             /*
//             *  玩家坐下
//             */
//             case "sit":
//                 var data = context.data;
//                 //首先判断玩家是否已经在房间中，需同步信息
//                 if (onRoomControllers.hasOwnProperty(data.id.toString())) {

//                 }
//                 else {
//                     //判断房间中玩家人数，满十人则不可再加入
//                     if (Object.keys(onRoomControllers).length === 10) {

//                     }
//                     else {
//                         var key = data.id.toString();
//                         //判断是否已经在在线列表中
//                         if (!onlineControllers.hasOwnProperty(key)) {
//                             onlineControllers[key].id = data.id;
//                             onlineControllers[key].conn = this;
//                         }
//                         //判断玩家是否已经在房间中
//                         if (!onRoomControllers.hasOwnProperty(key)) {
//                             onRoomControllers[key] = onlineControllers[key];
//                             //同一队玩家要有自己的标识(座位号)

//                         }
//                     }
//                 }
//                 break;
//             /*
//             *  玩家行为控制
//             *  1:上 2:下 3:左 4:右 5：
//             */
//             case "control":

//                 break;
//             /*
//             *  玩家到达胜利点
//             *  同一队的两个玩家都到达胜利点才算获得胜利
//             */
//             case "victory":
//                 break;
//         }
//     });
//     conn.on("close", function (code, reason) {
//         console.log("关闭连接");
//     });
//     conn.on("error", function (code, reason) {
//         console.log("异常关闭");
//     });
// }).listen(8003);
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
//# sourceMappingURL=app.js.map


////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// var onlineControllers = [];
var mainClient = {};
var seats = {};

ws.createServer(function (conn) {
    conn.on("text", function (str) {
        console.log("收到的信息为:" + str);
        try {
            var context = JSON.parse(str);
        }
        catch (e) {
            console.error(e);
            return;
        }
        switch (context.opt) {
            case "client_login":
                mainClient = this;
                seats = {};
                break;
            case "controller_login":
                // onlineControllers.push(this);
                var resultData = {
                    opt: 'state',
                    data: seats
                }
                this.sendText(JSON.stringify(resultData))
                break;
            case "sit":
                var index = context.data;
                if(index > 0 && index < 11 && (!seats[index])){
                    seats[index] = true;
                    var resultData = {
                        opt: 'sit_result',
                        data: {id:index}
                    }
                    this.sendText(JSON.stringify(resultData))
                }
                break;
            case "control":
                var resultData = {
                    opt: 'control_data',
                    data: context.data
                }
                mainClient.sendText(JSON.stringify(resultData))
                break;
        }
    });
    conn.on("close", function (code, reason) {
        console.log("关闭连接");
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭");
    });
}).listen(8003);

// setInterval(function(){

// })