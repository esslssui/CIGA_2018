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
            for (var id in data) {
                if(this.arrSeat[id - 1]){
                     var btn = this.arrSeat[id - 1].getComponent(cc.Button);
                }
                if(data[id]){
                    btn.interactable = false;
                }
                else{
                    btn.interactable = true;
                }                
            }
        }.bind(this))

        wsat.net.addListen('sit_result',function(data){
            if(data && data.id){
                wsat.id = data.id;
                cc.director.loadScene('control');
            }
            else{
                this.nodeLayout.active = false;
                this.nodeTips.active = true;
            }
        }.bind(this))

        this.schedule(function(){
            wsat.net.send('controller_login');
        },1);
    },

    // update (dt) {},

    onStart() {
        this.nodeLayout.active = true;
        this.nodeStart.active = false;
    },
    onChoose(e, d) {
        wsat.net.send('sit', d);
    }
});
