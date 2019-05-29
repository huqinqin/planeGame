function CommonObject() {
    this.x;
    this.y;
    this.direction;
    this.lastframe;
}

/*子弹，飞机都具有更新、移动、渲染等方法，所以可以抽象出一个子类*/
function moveObject(x,y,v,dir,frm) {
    var _this = this;
    CommonObject.call(this);
    this.x = x;
    this.y = y;
    this.speed = v;
    this.direction = dir;
    this.lastframe = frm;
    this.targetX = x;
    this.targetY = y;
    this.updateMove = function (frame) {
        var t = frame - _this.lastframe;
        var realDistance = t * _this.speed;//每一帧要走的距离
        var dx = _this.targetX - _this.x; //_this.x和_this.y不断的变化
        var dy = _this.targetY - _this.y;
        var expectDistance = Math.sqrt(dx*dx + dy*dy); //要走到目标位置的总距离
        if(realDistance >= expectDistance){ //到达终点,运动停止的条件
            _this.x = _this.targetX;
            _this.y = _this.targetY;
        }else{
            /*未到达终点的时候，每走一帧距离就修正方向,直到到达目的距离*/
            /*运动过程中不断修正方向*/
            var angle = Math.atan2(dy,dx);
            _this.direction = angle;
            _this.x += realDistance * Math.cos(angle);//使_this.x和_this.y不断的变化,离目标更近一步
            _this.y += realDistance * Math.sin(angle);
        }
        this.lastframe = frame;
    };
    this.update = function (frame) {
        _this.updateMove(frame)
    };
    this.setTargetPosition = function (x,y) {//在画布上点击的时候修正方向
        _this.targetX = x;
        _this.targetY = y;
        /*var dx = x - _this.x;
        var dy = y - _this.y;
        var angle = Math.atan2(dy,dx);
        _this.direction = angle;*/
    };
    this.render = function (ctx) {
        ctx.save();
        ctx.translate(_this.x,_this.y);
        ctx.rotate(_this.direction);
        ctx.beginPath();
        ctx.arc(0,0,50,0,Math.PI * 2);
        ctx.moveTo(0,0);
        ctx.lineTo(100,0);
        ctx.stroke();
        ctx.restore();
    };
}

function Plane(x,y,v,dir,frm) {
    var _this = this;
    this.CD = 30;
    this.lastFireFrame = 0
    moveObject.call(this,x,y,v,dir,frm);
    this.fire = function () {
        if(_this.frame < _this.lastFireFrame + _this.CD){

        }else{
            var bullet = new Bullet(_this.x,_this.y,5,_this.direction,logicGame.frame);
            var dist = 500;
            var dx = dist * Math.cos(_this.direction);
            var dy = dist * Math.sin(_this.direction);
            bullet.setTargetPosition(_this.x + dx,_this.y + dy);
            logicGame.bullets.push(bullet);
            _this.lastFireFrame = logicGame.frame;
        }
    }
}

function Bullet(x,y,v,dir,frm) {
    var _this = this;
    this.dead = false;
    moveObject.call(this,x,y,v,dir,frm);
    /*需要重新改写update方法*/
    this.update = function (frame) {
        _this.updateMove(frame);
        if(_this.x == _this.targetX && _this.y == _this.targetY){
            _this.dead = true;
        }else{
            for(var i=0;i<logicGame.enemies.length;i++){
                var e = logicGame.enemies[i];
                var dx = _this.x - e.x;
                var dy = _this.y - e.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if(dist <= 50){
                    _this.dead = true;
                    e.dead = true
                }
            }
        }
    }
}

function Enemy(x,y,v,dir,frm) {
    var _this = this;
    Bullet.call(this,x,y,v,dir,frm);
    this.update = function (frame) {
        _this.updateMove(frame);
        if(_this.x == _this.targetX && _this.y == _this.targetY){
            _this.dead = true;
        }
    }
}

