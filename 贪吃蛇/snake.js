/**
 * 面向对象
 * @param {obj} id canvasId
 * @param {obj} score 得分
 * @param {obj} speed 速度
 * @param {number} x 画布x轴大小
 * @param {number} y 画布y轴大小
 */
function Snake(id, score, speed, x, y){
    this.id = document.getElementById(id);
    this.ctx = this.id.getContext("2d");
    this.cellWidth = 10;    //每个格子的大小
    this.score = document.getElementById(score);
    this.speed = document.getElementById(speed);
    this.x = x;
    this.y = y;
    // 画canvas大小 
    this.id.width = this.x * this.cellWidth;
    console.log(this.id.width);
    this.id.height = this.y * this.cellWidth;
    this.id.style.border = "1px solid black";

    this.setDirection();
}

Snake.prototype = {
    init: function() {
        this.snakeArr = [[0,parseInt(this.y/2)],[1,parseInt(this.y/2)]];    //蛇身长度。初始化时只有两个长度，每一个点存了[x,y]两个坐标,parseInt(this.y/2)是整个canvas的中间取整，length/push的是蛇头，unshift的是蛇尾
        this.foodPosition = []; //储存当前食物的位置,这里每次都初始化为0
        this.direction = null; 
        this.nextDirection = null;  //按键按了以后存到下一步,方向：右1，下2，左3，上4
        //画画布
		this.ctx.fillStyle ="#fff";
        this.ctx.fillRect(0,0,this.cellWidth*this.x,this.cellWidth*this.y);
    
        this.drawSnake();   //记得写this
        this.drawFood();
        this.setTime();
    },
    //初始画蛇
    drawSnake: function() {
        var snakeArr = this.snakeArr;
        for(var i=0; i<snakeArr.length; i++){   //遍历蛇的长度，并画出来;通过snakeArr数组里的存的每一个坐标来画出不同的点
            this.drawRect("#558B3A", snakeArr[i]);
        }
    },
    //初始化食物
    drawFood: function() {
        var pos = [this.getRandom(this.x), this.getRandom(this.y)]; //随机方块的范围
        this.drawRect("#FFB418", pos);  
    },
    /**获取方块左上角坐标，用来在画方块的时候给出x,y坐标
     * @param {obj} pos 坐标位置数组
     */
    getRectLeftTopCoordinate: function(pos) {
        return [(pos[0]-1)*this.cellWidth+1,(pos[1]-1)*this.cellWidth+1]; //??不懂
    },
    /**画方块
     * @param {obj} color 颜色字符串
     * @param {obj} pos 坐标位置数组
     */
    drawRect: function(color,pos) {
        this.ctx.fillStyle = color;
        area = this.getRectLeftTopCoordinate(pos);
        this.ctx.fillRect(area[0], area[1], this.cellWidth-1,this.cellWidth-1);    //从每个方块的左上边是坐标；比每个格子小1，就会自然的让每个方块之间有1的距离
    },
    //蛇的移动
    //注意！！当moveSnake()加到了setTime()里面，this就不再指向Snake了，而是指向window
    // setInterval中的回调函数是在全局环境下调用的，因此this指向window
    moveSnake: function(){
        var snakeHead = this.snakeArr[this.snakeArr.length -1 ];
        // this.snakeArr.push()
        
    },
    //控制方向
    setDirection: function() {
        //键盘按下事件
        document.onkeydown = function(e) {
            var keychar;
            var numcheck;
            this.direction = e.which;
            console.log(this.direction)
        }
        // this.n += 10;
        switch(this.direction){
            case 39: //右
                // this.ctx.save();
                // this.ctx.clearRect()
                // this.drawSnake(10,0);
                // console.log("右");
                this.nextDirection = 1;
                break;
            case 40: //下
                this.nextDirection = 2;
                break;
            case 37: //左
                this.nextDirection = 3;
                break;
            case 38: //上
                this.nextDirection = 4;
                break;
        }
    },
    //定时器
    setTime: function() {
        // setInterval中的回调函数是在全局环境下调用的，因此this指向window
        //把this当成参数传进来，保证还能指到Snoke实例，不然this
        //this是关键字，不能作为形参的
        // 解决方案有二
        // 1.声明一个变量保存this，回调函数中直接调用这个变量的方法
        // 2.使用箭头函数，自动绑定当前作用域的this
        (function(theThis){
			var that = theThis;
			that.timer = setTimeout(function() {
				that.moveSnake();			
			}, 500);
        })(this);
    },
    //生成随机正整数 1到n之间。
    getRandom: function (n){
        this.foodPosition.push(Math.floor(Math.random()*n+1));  //把坐标存入数组，就可以得到当前食物的坐标
        console.log(this.foodPosition);
        return Math.floor(Math.random()*n+1);
    }
    
}

