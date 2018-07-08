// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

//出生位置配置
const arrPos = [
    { x: -900, y: 100 },
    { x: -480, y: 320 },
    { x: 100, y: 100 },
    { x: 480, y: 320 },
    { x: 600, y: 100 },

    { x: -900, y: -100 },
    { x: -480, y: -320 },
    { x: 100, y: -100 },
    { x: 480, y: -320 },
    { x: 600, y: -100 },
]

const arrMirrorPos = [
    { x: -900, y: 100 },
    { x: -480, y: 320 },
    { x: 100, y: 100 },
    { x: 480, y: 320 },
    { x: 600, y: 100 },
    { x: 100, y: 100 },
    { x: 480, y: 320 },
    { x: 600, y: 100 },

    { x: -900, y: -100 },
    { x: -480, y: -320 },
    { x: 100, y: -100 },
    { x: 480, y: -320 },
    { x: 600, y: -100 },
    { x: 100, y: -100 },
    { x: 480, y: -320 },
    { x: 600, y: -100 },
]

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
        playerLayer:cc.Node,
        endNode:cc.Node,
        playerPrefab:cc.Prefab,
        wallBox:cc.Node,
        arrScoreLabel: [cc.Label],
        arrPlayer:[cc.Node],
        arrScore: []
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        //向对象池预加载对象
        for (var i = 0; i < 10; ++i) {
            this.initNodeToPool('player', 'player');
        }

        //初始化墙的碰撞组件标签
        var allWall = this.wallBox.children;
        for (var i in allWall){
            var box = allWall[i].getComponent(cc.BoxCollider);
            box.tag = 2333;
        }

        //初始化分数
        this.arrScore = [2,2,2,2,2];

        // //先生成一个测试
        // this.arrPlayer[0] = this.createNodeFromPool('player',{id:1,group:1})
        // this.arrPlayer[0].parent = this.playerLayer;
        for(var i in arrPos){
            var id = parseInt(i)+1;
            var group = id > 5?id -5:id;
            this.arrPlayer[i] = this.createNodeFromPool('player', { id: id, group: group});
            this.arrPlayer[i].parent = this.playerLayer;
            this.arrPlayer[i].setPosition(arrPos[i]);
        }


        // //键盘监听
        // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
        //     switch (event.keyCode) {
        //         case cc.KEY.w:
        //             this.arrPlayer[0].getComponent('player').move(1);
        //             break;
        //         case cc.KEY.s:
        //             this.arrPlayer[0].getComponent('player').move(2);
        //             break;
        //         case cc.KEY.a:
        //             this.arrPlayer[0].getComponent('player').move(3);
        //             break;
        //         case cc.KEY.d:
        //             this.arrPlayer[0].getComponent('player').move(4);
        //             break;
        //         case cc.KEY.j:
        //             this.arrPlayer[0].getComponent('player').transfer();
        //             break;
        //     }
        // }.bind(this));

        // //释放监听
        // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (event) {
        //     switch (event.keyCode) {
        //         case cc.KEY.w:
        //             this.arrPlayer[0].getComponent('player').move(666);
        //             break;
        //         case cc.KEY.s:
        //             this.arrPlayer[0].getComponent('player').move(666);
        //             break;
        //         case cc.KEY.a:
        //             this.arrPlayer[0].getComponent('player').move(666);
        //             break;
        //         case cc.KEY.d:
        //             this.arrPlayer[0].getComponent('player').move(666);
        //             break;
        //         // case cc.KEY.j:
        //         //     this.arrPlayer[0].getComponent('player').transfer();
        //         //     break;
        //     }
        // }.bind(this));

        wsat.net.addListen('',function(data){
            var id = data.id;
            var num = data.num;
            if(this.arrPlayer[id - 1]){
                var com = this.arrPlayer[id -1 ].getComponent('player');
                if(com){
                    if(num < 999){
                        com.move(num);
                    }
                    else{
                        com.transfer();
                    }
                }
            }
            else if(num == 999){
                var group = id > 5?id -5:id;
                if(this.arrScore[group - 1] > 1){//重生
                    this.arrPlayer[id - 1] = this.createNodeFromPool('player', { id: id, group: group });
                    this.arrPlayer[i].parent = this.playerLayer;
                    this.arrPlayer[i].setPosition(arrPos[i]);
                }
            }
        }.bind(this))

        //开启碰撞系统
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        manager.enabledDrawBoundingBox = true;


        //监听部分
        wsat.on('getPartnerPos',function(data){
            var id = data.detail.id;
            var group = data.detail.group;
            var fun = data.detail.fun;
            var theOtherId = id == group?group + 5:group;
            var theOtherplayer = this.arrPlayer[theOtherId - 1];
            if(theOtherplayer){
                var com = theOtherplayer.getComponent('player');
                if (com && com.otherSideMirror){
                    fun(com.otherSideMirror);
                }
            }
        }.bind(this));

        wsat.on('getRandomPos',function(data){
            var id = data.detail.id;
            var fun = data.detail.fun;
            var index = null;
            if(id < 6){
                index = this.getRandomNum(0, 7);
            }
            else{
                index = this.getRandomNum(8, 15);
            }
            var pos = arrMirrorPos[index];
            if(pos){
                fun(pos);
            }
        }.bind(this));

        wsat.on('die',function(data){
            var group = data.detail;
            this.arrScore[group - 1] -= 1;
        }.bind(this))

        wsat.on('addLife', function (data) {
            var group = data.detail;
            this.arrScore[group - 1] += 1;
        }.bind(this))

        //回收节点
        wsat.on('recycle',function(data){
            var com = data.detail;
            this.arrPlayer[com.id - 1] = null;
            this.recycleNodeToPool(com.node);
        }.bind(this));
    },

    getRandomNum: function(min,max){
        var delta = max - min;
        return min + Math.round(Math.random() * delta);
    },

    update (dt) {
        for(var i in this.arrScore){
            if(this.arrScoreLabel[i]){
                this.arrScoreLabel[i].string = this.arrScore[i];
            }
        }
        for(var j = 0; j < 5; ++j){
            if (!this.arrPlayer[j]){
                continue;
            }
            var com = this.arrPlayer[j].getComponent('player');
            if (com && com.inVictory){
                if (!this.arrPlayer[j + 5]){
                    continue;
                }
                var com2 = this.arrPlayer[j + 5].getComponent('player');
                if(com2 && com2.inVictory){
                    for(var k in this.arrPlayer){
                        if (!this.arrPlayer[k]) {
                            continue;
                        }
                        var com_x = this.arrPlayer[k].getComponent('player');
                        com_x.die();
                    }
                    this.endNode.active = true;
                    this.endNode.setScale(0.5);
                    this.endNode.runAction(cc.sequence(cc.scaleTo(2,1.6),cc.callFunc(()=>{
                        cc.director.loadScene('start');
                    })))
                }
            }
        }
    },

    ////////////////////////////////////////////////////////////////
    //                        对象管理                             //
    ////////////////////////////////////////////////////////////////
    //初始化对象池
    initNodeToPool: function (str, comStr) {
        if (!this.allPool) {
            this.allPool = new Object();
        }
        if (!this.allPool[str]) {
            if (comStr) {
                this.allPool[str] = new cc.NodePool(comStr);
            }
            else {
                this.allPool[str] = new cc.NodePool();
            }
        }
        var newPoolObject = null;
        switch (str) {
            case 'player':
                newPoolObject = cc.instantiate(this.playerPrefab);
                break;
            default:
                console.log('未找到对象池...');
                break;
        }
        if (newPoolObject) {
            newPoolObject.poolTag = str;
            this.allPool[str].put(newPoolObject);
        }
    },
    //从对象池取出
    createNodeFromPool: function (str, param) {
        if (this.allPool[str].size() <= 0) {
            this.initNodeToPool(str);
        }
        var obj = this.allPool[str].get(param);
        return obj;
    },
    //回收至对象池
    recycleNodeToPool: function (obj) {
        if (!obj) {
            return;
        }
        if (!obj.poolTag) {
            return;
        }
        var str = obj.poolTag
        if (this.allPool[str]) {
            this.allPool[str].put(obj);
        }
    },

});
