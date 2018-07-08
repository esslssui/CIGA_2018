// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

const speed = 4000;

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
        backupPos:null,
        hp:1000,
        id:null,
        group:null,
        direction:null,
        inMirror:false,
        otherSideMirror:null,
        inTheOtherWorld:false,
        isLive:true,
        inVictory:false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {

    // },

    update (dt) {
        if(!this.id){
            return;
        }
        var pos = this.node.getPosition();

        this.backupPos.x = pos.x;
        this.backupPos.y = pos.y;

        if(this.inTheOtherWorld){
            this.hp -= 1;
            cc.log(this.hp);
            if(this.hp <= 0){
                this.die();
            }
        }
        else if(this.hp < 1000){
            this.hp += 1;
        }
    },

    unuse(){
        this.backupPos = null;
        this.hp = 1000;
        this.id = null;
        this.group = null;
        this.direction = null;
        this.inMirror = false;
        this.otherSideMirror = null;
        this.inTheOtherWorld = false;
        this.isLive = true;

        this.node.setPosition(-10000,-10000);
    },

    reuse(param){
        this.backupPos = {}
        this.id = param.id;
        this.group = param.group;
        var ani = this.getComponent(cc.Animation);
        if(ani){
            cc.log('walk_' + this.id + '_0' + '播放动画')
            ani.play('walk_' + this.id + '_0');
        }
        var box = this.getComponent(cc.CircleCollider);
        if(box){
            box.enabled = true;
            box.tag = this.id;
        }
    },

    move(direction){

        if(!this.isLive){
            return;
        }
        // var pos = this.node.getPosition();

        // this.backupPos.x = pos.x;
        // this.backupPos.y = pos.y;
        if(!direction){
            return;
        }

        if(this.direction && direction === this.direction){
            return;
        }

        var ani = this.getComponent(cc.Animation);
        if (!ani) {
            return;
        }

        this.direction = direction;



        switch(direction){
            case 1:
                // pos.y += this.step;
                this.node.stopAllActions();
                this.node.runAction(cc.moveBy(10, 0, speed))
                ani.play('walk_' + this.id + '_1')
                break;
            case 2:
                // pos.y -= this.step;
                this.node.stopAllActions();
                this.node.runAction(cc.moveBy(10, 0, -speed))
                ani.play('walk_' + this.id + '_1')
                break;
            case 3:
                // pos.x -= this.step;
                var sx = this.node.scaleX;
                this.node.scaleX = sx < 0?-sx:sx;
                this.node.stopAllActions();
                this.node.runAction(cc.moveBy(10, -speed, 0))
                ani.play('walk_' + this.id + '_1')
                break;
            case 4:
                // pos.x += this.step;
                var sx = this.node.scaleX;
                this.node.scaleX = sx < 0 ? sx : -sx;
                this.node.stopAllActions();
                this.node.runAction(cc.moveBy(10, speed, 0))
                ani.play('walk_' + this.id + '_1')
                break;
            case 666:
                this.node.stopAllActions();
                ani.play('walk_' + this.id + '_0')
                break;
        }
        // this.node.setPosition(pos);
    },

    transfer(){
        if(!this.isLive){
            return;
        }
        if(!this.inMirror){
            return;
        }
        if(this.inTheOtherWorld){
            var fun = function (pos) {
                var ani = this.getComponent(cc.Animation);
                if (ani) {
                    var clip = ani.play('transfer');
                }
                if (clip) {
                    clip.once('finished', () => {
                        ani.play('walk_' + this.id + '_0');
                        // var nodePos = this.node.parent.convertToNodeSpaceAR(pos)
                        this.node.setPosition(pos);
                        this.inTheOtherWorld = false;
                    })
                }
            }.bind(this);
            wsat.emit('getRandomPos', { id: this.id, group: this.group, fun: fun });
            return;
        }

        var fun = function(pos){
            var ani = this.getComponent(cc.Animation);
            if (ani) {
                var clip = ani.play('transfer');
            }
            if (clip) {
                clip.once('finished', () => {
                    ani.play('walk_' + this.id + '_0');
                    var nodePos = this.node.parent.convertToNodeSpaceAR(pos)
                    this.node.setPosition(nodePos);
                    this.inTheOtherWorld = true;
                })
            }
        }.bind(this);
        wsat.emit('getPartnerPos',{id:this.id,group:this.group,fun:fun});
        
    },

    die(){
        this.isLive = false;
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(cc.rotateBy(1, 360),cc.callFunc(()=>{
            wsat.emit('die',this.group);
            wsat.emit('recycle', this);
        })));
        var box = this.getComponent(cc.CircleCollider);
        if (box) {
            box.enabled = false;
        }
    },

    //碰撞
    onCollisionEnter: function (other, self) {
        console.log('on collision enter');

        // // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        // var world = self.world;

        // // 碰撞组件的 aabb 碰撞框
        // var aabb = world.aabb;

        // // 上一次计算的碰撞组件的 aabb 碰撞框
        // var preAabb = world.preAabb;

        // // 碰撞框的世界矩阵
        // var t = world.transform;

        // // 以下属性为圆形碰撞组件特有属性
        // var r = world.radius;
        // var p = world.position;

        // // 以下属性为 矩形 和 多边形 碰撞组件特有属性
        // var ps = world.points;

        if(other.tag == 2333){
            this.node.stopAllActions();
            if(this.backupPos){
                this.node.setPosition(this.backupPos);
            }
        }

        if(other.tag == 0){
            this.inMirror = true;
            this.otherSideMirror = other.node.convertToWorldSpaceAR(cc.p(-100,0))
        }

        if (other.tag == 666666) {
            this.inVictory = true;
        }

        if(
            (self.tag < 6 && other.tag > 5)
            || (self.tag > 5 && other.tag < 6)
            || (self.tag + 1 != other.tag && self.tag - 4 != other.tag)
        ){
            return;
        }
        wsat.audio.play(2, false, 1);
        var ani = this.getComponent(cc.Animation);
        if(ani){
            var clip = ani.play('walk_' + this.id);
        }
        if(clip){
            clip.on('finished',()=>{
                ani.play('walk_' + this.id + '_0')
                wsat.emit('addLife',this.group);
            })
        }
        var com = other.node.getComponent('player');
        if(com){
            com.die();
        }

    },

    onCollisionStay: function (other, self) {
        console.log('on collision stay');

        if (other.tag == 2333) {
            this.node.stopAllActions();
            if(this.backupPos){
                this.node.setPosition(this.backupPos);
            }
        }

        if (
            (self.tag < 6 && other.tag > 5)
            || (self.tag > 5 && other.tag < 6)
            || (self.tag + 1 != other.tag && self.tag - 4 != other.tag)
        ) {
            return;
        }
        wsat.audio.play(2, false, 1);
        var ani = this.getComponent(cc.Animation);
        if (ani) {
            var clip = ani.play('walk_' + this.id);
        }
        if (clip) {
            clip.on('finished', () => {
                ani.play('walk_' + this.id + '_0')
                wsat.emit('addLife', this.group);
            })
        }
        var com = other.node.getComponent('player');
        if (com) {
            com.die();
        }
        
    },

    onCollisionExit: function (other, self) {
        console.log('on collision exit');
        if(other.tag == 0){
            this.inMirror = false;
            this.otherSideMirror = null;
        }
        if (other.tag == 666666) {
            this.inVictory = false;
        }
    }
});
