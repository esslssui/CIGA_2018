window.global = window.global || window;
global.wsat = {};
wsat.net = require('net');

wsat.on = on;
wsat.off = off;
wsat.emit = emit;

function on(event, func) {
    if (!func) {
        try {
            throw new Error(event + "事件回调不能为空");
        } catch (error) {
            cc.log(error);
        }
    }
    if (cc.find('Canvas')) {
        cc.find('Canvas').on(event, func);
        cc.find('Canvas').once()
    }
}

function off(event, func) {
    if (cc.find('Canvas')) {
        if (func) {
            cc.find('Canvas').off(event, func);
        }
        else {
            cc.find('Canvas').off(event);
        }
    }
}

function emit(event, data) {
    if (cc.find('Canvas')) {
        cc.find('Canvas').emit(event, data);
    }
}