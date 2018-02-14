/**
 * 面向对象
 * @param {obj} id canvasId
 * @param {obj} score 得分
 * @param {obj} speed 速度
 * @param {number} x 画布x轴大小
 * @param {number} y 画布y轴大小
 */
function Snake(id, score, speed, x, y){
    // this.snakeArr = [0, this.cellWidth, this.cellWidth*2, this.cellWidth*3, this.cellWidth*4, this.cellWidth*5, this.cellWidth*6];  //蛇身位置,不能计算！！
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
    // this.ctx.strokeRect(0, 0, this.id.width, this.id.height);    //因为有和画布等大的实心的蛇要画，这里画空心的会冲突，所以用boreder来显示边框
    this.id.style.border = "1px solid black";

    this.setDirection();
}

Snake.prototype = {
    init: function() {
        this.snakeArr = [[1,parseInt(this.y/2)],[2,parseInt(this.y/2)]];    //蛇身长度。初始化时只有两个长度，每一个点存了[x,y]两个坐标,parseInt(this.y/2)是整个canvas的中间取整，length/push的是蛇头，unshift的是蛇尾
        this.foodPosition = []; //储存当前食物的位置,这里每次都初始化为0
        this.direction = 1; //方向：右1，下2，左3，上4
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
        // this.drawRect("#558B3A", this.snakeArr[0], this.cellWidth*this.y);
        // this.drawRect("#558B3A", this.snakeArr[1], this.cellWidth*this.y);

        // this.ctx.fillRect(this.cellWidth*2, this.cellWidth*this.y, this.cellWidth-1,this.cellWidth-1);
        // this.ctx.fillRect(this.cellWidth, this.cellWidth*this.y, this.cellWidth-1,this.cellWidth-1);
        // this.ctx.fillRect(0, this.cellWidth*this.y, this.cellWidth-1,this.cellWidth-1);
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
    moveSnake: function(){
        // var snakeArr = this.snakeArr;
        console.log(this);  //window
        console.log(this.snakeArr);
    },
    //控制方向
    setDirection: function() {
        //键盘按下事件
        document.onkeydown = function(e) {
            // var keynum;
            var keychar;
            var numcheck;
            // keynum = e.which;
            this.direction = e.which;
            console.log(this.direction)
        }
        // this.n += 10;
        switch(this.direction){
            case 39: //右
                this.ctx.save();
                // this.ctx.clearRect()
                this.drawSnake(10,0);
                console.log("右");
                break;
            case 2: //下

                break;
            case 3: //左

                break;
            case 4: //上

                break;
        }
    },
    //定时器
    setTime: function() {
        // setInterval(this.moveSnake(),500);   //为什么这么写只执行一次,因为回调函数是moveSnake的返回值，而不是moveSnake本身！
        // setInterval(this.moveSnake,500);    //this.moveSnake表示的是函数本身，this.moveSnake()的是返回值
        // console.log("this.moveSnake():"+this.moveSnake());  //是undefined，setInterval的fun是undefined时，不会报错
        // console.log("this.moveSnake:"+this.moveSnake);  

        setTimeout(this.moveSnake.call(Snake),500);  //为什么这样指过去不行？

        // (function(theThis){
		// 	var that = theThis;
		// 	that.timer = setTimeout(function() {
		// 		that.moveSnake();			
		// 	}, 500);
        // })(this);

        // var timeTest = function(theThis) {
        //     var that = theThis;
        //     that.timer = setTimeout(function() {
		// 		that.moveSnake();	
        //     },500);
        // }

        var timeTest = function(theThis) {
            var that = theThis;
            that.timer = setTimeout(function() {
				that.moveSnake();	
            },500);
        }
        // var timeTest = setTimeout(function(this) {
        //     this.moveSnake();	
        // },500);
        timeTest(this);
        console.log(this);
    },
    //生成随机正整数 1到n之间。
    getRandom: function (n){
        this.foodPosition.push(Math.floor(Math.random()*n+1));  //把坐标存入数组，就可以得到当前食物的坐标
        console.log(this.foodPosition);
        return Math.floor(Math.random()*n+1);
    }
    
}

