/**
 * 面向对象
 * @param {obj} id canvasId
 * @param {obj} score 得分
 * @param {obj} speed 速度
 * @param {number} x 画布x轴大小
 * @param {number} y 画布y轴大小
 * @param {obj} color 画点的颜色：sanke蛇的颜色，food食物的颜色,white用来掩盖蛇尾的白色
 */
function Snake(id, score, speed, x, y){
    this.id = document.getElementById(id);
    this.ctx = this.id.getContext("2d");
    this.cellWidth = 10;    //每个格子的大小
    this.score = document.getElementById(score);
    this.speed = document.getElementById(speed);
    this.x = x;
	this.y = y;
	this.color = {
		snake: "#558B3A",
        food: "#FFB418",
        white: "#fff"
	};
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
		var color = this.color;
        for(var i=0; i<snakeArr.length; i++){   //遍历蛇的长度，并画出来;通过snakeArr数组里的存的每一个坐标来画出不同的点
            this.drawRect(color.snake, snakeArr[i]);
        }
    },
    //初始化食物
    drawFood: function() {
		var color = this.color;
        var pos = [this.getRandom(this.x), this.getRandom(this.y)]; //随机方块的范围
        this.drawRect(color.food, pos);  
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
    /**蛇的移动
    *注意！！当moveSnake()加到了setTime()里面，this就不再指向Snake了，而是指向window
	* setInterval中的回调函数是在全局环境下调用的，因此this指向window
	* snakeHead蛇头位置，也是个[x,y]数组
	* 思路：把当前蛇头位置的x或y轴+1，然后重新堆入snakeArr尾巴，再把snakeArr的[0]消除,并在画蛇尾的时候，用白色，这样就会让之前画的方块看不见了，避免用clearRect来清除的麻烦，做到看似蛇在往前动的效果
	*/
    moveSnake: function(){
		var color = this.color;
		var snakeArr = this.snakeArr;
        var snakeHead = this.snakeArr[this.snakeArr.length -1 ];
		snakeHead = [snakeHead[0]+1, snakeHead[1]];
		snakeArr.push(snakeHead);
		this.drawRect(color.snake,snakeHead);	//push以后一定在重新再画一下，不然没效果!
		var tail = snakeArr.shift();	//删除蛇尾(上一次的蛇尾，不是当前的蛇尾),当成一个参数传进去，才会保证数组一直是两个，直接把snakeArr.shift()放入drawRect数组里面会有三个数
		this.drawRect(color.white, tail);	//用白色，这样可以掩盖之前画的蛇尾的颜色，避免用clearRect和save的麻烦
		// console.log("snakeHead = "+snakeHead);
        // console.log("tail = "+tail);
        // console.log("snakeArr = "+snakeArr);
        
        this.setDirection();
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
        switch(this.direction){
            case 39: //右
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
			that.timer = setInterval(function() {
				that.ctx.save();
				that.moveSnake();	
				that.ctx.restore();			
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

