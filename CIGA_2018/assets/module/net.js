var net = {};

module.exports = net;

//服务器地址
const serverAddress = 'ws://localhost:8003'

//服务器连接超时时间
const outTime = 1000;

//接收消息的监听列表
var listenList = [];

//webSocket
var ws = null;

//网络状态
net.state = false;

//网络延迟
net.ping = 0;

//添加消息监听
net.addListen = function (dataHead, funcAndData){
    if (typeof (dataHead) != 'string'){
        cc.error('数据头应为string类型');
        return;
    }
    for (i in listenList) {
        if (listenList[i].opt == dataHead) {
            listenList[i].func = funcAndData;
            return;
        }
    }
    cc.log('添加监听：' + dataHead);
    listenList.push({ opt: dataHead, func: funcAndData });
}

//发送消息
net.send = function (dataHead, dataBody){
    //先判断连接
    if (ws == null) {
        return cc.error('尚未连接服务器');
    }
    else if (ws.readyState !== WebSocket.OPEN) {
        return cc.error('服务器未开启或已关闭');
    }
    //再判断数据
    if (dataHead == null) {
        return cc.error('空数据头不建议发送');
    }
    //打包数据
    var needSendData = {
        opt: dataHead,
        data: dataBody,
    }
    //发送数据
    cc.log('发送数据：' + needSendData.opt + '|' + needSendData.data);
    ws.send(JSON.stringify(needSendData));
}

//监听消息
var onmessage = function (event) {
    cc.log('接受消息：' + event);
    try {
        var netData = JSON.parse(event.data);
    }
    catch (e) {
        cc.error(e);
        return;
    }

    var dataHead = netData.opt;
    var dataBody = netData.data;
    var onFunc = null;
    for (i in listenList) {
        if (listenList[i].opt == dataHead) {
            onFunc = listenList[i].func;
        }
    }
    if (onFunc != null && typeof (onFunc) == 'function') {
        onFunc(dataBody);
    }
    else {
        cc.log('收到来自服务器无法识别处理的消息 请检查版本:', event);
    }
};

//监听开启状态
var onopen = function (event) {
    console.log("Send Text WS was opened.");
};

//监听发送错误
var onerror = function (event) {
    console.log("Send Text fired an error");
};

//监听连接断开
var onclose = function (event) {
    console.log("WebSocket instance closed.");
};

//网络连接状态监听
var startListen = function(ws){
    ws.onopen = onopen;
    ws.onmessage = onmessage;
    ws.onerror = onerror;
    ws.onclose = onclose;
}

//启动
net.start = function(cbf_S,cbf_F){
    ws = new WebSocket(serverAddress);
    startListen(ws);
    var func = function () {
        if (ws.readyState === WebSocket.OPEN) {
            if (cbf_S != null && typeof (cbf_S) == 'function') cbf_S();
        }
        else {
            if (cbf_F != null && typeof (cbf_F) == 'function') cbf_F();
        }
    }
    setTimeout(func, outTime);
}

