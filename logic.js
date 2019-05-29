var logicGame = null;
function onLoad() {
    logicGame = new Game();
    logicGame.onLoad();
}
function Game() {
    var _this = this;
    this.mouseX = 0;
    this.mouseY = 0;
    this.canvas = null;
    this.context = null;
    this.frame = 0;
    this.width = 0;
    this.height = 0;
    this.plane;
    this.bullets = [];
    this.enemies = [];
    this.lastEnemyFrame = 0;
    this.CDTime = 60;
    this.onClick = function (event) {
        var x = event.pageX - _this.canvas.offsetLeft;
        var y = event.pageY - _this.canvas.offsetTop;
        _this.mouseX = x;
        _this.mouseY = y;
        _this.plane.setTargetPosition(x,y);
    };
    this.onMouseMove = function () {
        var x = event.pageX - _this.canvas.offsetLeft;
        var y = event.pageY - _this.canvas.offsetTop;
        _this.mouseX = x;
        _this.mouseY = y;
    };
    this.onKeyDown = function (event) {
        if(event.keyCode == 32){ // 空格
            _this.plane.fire();
        }
    }
    this.update = function () {
        /*创建敌人*/
        if(_this.frame >= _this.lastEnemyFrame + _this.CDTime){
            var createRandomPositionX = Math.random() * _this.width;
            var createRandomPositionY = Math.random() * _this.height;
            var direction = Math.random() * Math.PI * 2;
            var dist = 500;
            var dx = dist * Math.cos(direction);
            var dy = dist * Math.sin(direction);
            var e = null;
            e = new Enemy(createRandomPositionX,createRandomPositionY,1,direction,_this.frame);
            _this.enemies.push(e);
            e.setTargetPosition(createRandomPositionX + dx,createRandomPositionY + dy);
            _this.lastEnemyFrame = _this.frame
        }
        _this.plane.update(_this.frame);
        for(var i=_this.bullets.length - 1; i>=0;--i){//for倒叙是因为splice会影响数组
            var b = _this.bullets[i];
            b.update(_this.frame);
            if(b.dead){
                _this.bullets.splice(i,1);
            }
        }
        for(var i=_this.enemies.length - 1;i>=0;--i){
            var c = _this.enemies[i];
            c.update(_this.frame);
            if(c.dead){
                _this.enemies.splice(i,1)
            }
        }
    };
    this.render = function () {
        _this.context.clearRect(0,0,_this.width,_this.height);
        _this.plane.render(_this.context);
        for(var i=0;i<_this.bullets.length;i++){
            var b = _this.bullets[i];
            b.render(_this.context);
        }
        for(var i=0;i<_this.enemies.length;i++){
            var c = _this.enemies[i];
            c.render(_this.context);
        }
    }
    this.loop = function () {
        window.requestAnimationFrame(_this.loop);
        ++_this.frame;
        _this.update();
        _this.render();
        //console.log(_this.frame);
    }
    this.onLoad = function(){
        var direction = (-45) * (Math.PI / 180);
        _this.canvas = document.getElementById("cvs");
        _this.context = _this.canvas.getContext("2d");
        _this.width = _this.canvas.width;
        _this.height = _this.canvas.height;
        _this.plane = new Plane(this.width/2,this.height/2,1,direction,_this.frame);
        _this.canvas.onclick = _this.onClick;
        _this.canvas.onmousemove = _this.onMouseMove;
        document.onkeydown = _this.onKeyDown;
        _this.loop();
    }
}