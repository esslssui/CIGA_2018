// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        nodeStart: cc.Node,
        nodeLayout: cc.Node,
        nodeTips: cc.Node,
        arrSeat: [],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.arrSeat = this.nodeLayout.children;
        wsat.net.addListen('state', function (data) {
            for (var i in data) {
                this.arrSeat[i].getComponent(cc.Button).interactable = data[i];
            }
        })
        wsat.net.addListen('sit_successful', function (data) {
            wsat.num = data.num;
            cc.director.loadScene('control');
        })
    },

    // update (dt) {},

    onStart() {
        wsat.net.send('controller_login');
        this.nodeLayout.active = true;
        this.nodeStart.active = false;
    },
    onChoose(e, d) {
        wsat.net.send('sit', d);
        this.scheduleOnce(function () {
            if (!wsat.num) {
                this.nodeLayout.active = false;
                this.nodeTips.active = true;
            }
        }, 1);
    }
});
