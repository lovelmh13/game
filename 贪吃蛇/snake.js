/*
    主要学到的东西：
        1.this的指向(作用域)问题，有的时候this并不会指向所在的实例，这里实例就是Snake。
          函数内部的this指向依赖于函数被调用的方式
          this具体指向哪儿要看异步api的具体实现而定，setTimeout是系统api，运行环境是系统决定的（这里系统把他设为全局）。如果是自行封装的api，那么久要看调用的环境
          Function.ptototype.call绑定的是函数运行时的this，这里你将this绑定到了Snake上，但是Snake是构造函数而非实例，因此打印结果是Snake构造函数而不是实例，这里要分清构造函数和实例的区别
          解决方案有二
            1.声明一个变量保存this，回调函数中直接调用这个变量的方法
            2.使用箭头函数，自动绑定当前作用域的this

          https://segmentfault.com/q/1010000013285743?_ea=3337392
        
        2.函数带()和不带()的区别
            函数带括号得到的是返回值，函数不带括号得到的是函数本身。
            setTimeout 的第一个参数是函数对象，一个常犯的错误是这样的 setTimeout(foo(), 1000)， 这里回调函数是 foo 的返回值，而不是foo本身。 大部分情况下，这是一个潜在的错误，因为如果函数返回 undefined，setTimeout 也不会报错。

        3. 面向对象的方式来写程序:
            在改动实例里面变量的值的时候，直接改this.变量，避免别的地方调用变量时值出错；
            如果要用var 变量 = this.变量，减少打字工作量的话，要在已经改过this.变量的值以后再重新赋值给var 变量，新var的这个变量是用来赋给别人值的，不要拿来改变变量自己的值，不然会出大毛病的！
        4. 对数组的运用
        5. 作用域问题：
            在面向对象里面用的这个this，我定义了一个新的var direction来代替this.direction, 这时要注意一个问题！——this.direction的作用域是整个实例的，而var后的direction就是局部的了，如果用了direction在局部改动这个值，this.direction的值实际上是没有变化的，而别的地方调用了this.direction，此时this.direction的值还是原来的值，并不是刚才改变的direction的值，这个时候就会出错了
            总结： 作用域的问题。var direction = this.direction;以后，我在这个function里面改了direction ，但是别的function用的是this.direction的值，这两个值不一样，就串了
        6. 两个数组的比较
            直接比较两个数组，即使两个数组的内容一样，结果也是false，简便方法是把两个数组都用.toString()转化成字符串，但是带来的问题就是数字“1”和字符串“1”会被认为相等
*/
/*
    疑问：
        1. return [(pos[0]-1)*this.cellWidth+1,(pos[1]-1)*this.cellWidth+1]; //??不懂
        2. console.log(this.foodPosition); //这个this.foodPosition食物坐标是错的,drawFood()里面的pos才是正确的食物坐标；但是为什么foodPosition和pos的数不一样，不明白
        3. 为什么蛇把食物吃掉，食物那一块就会自动加到蛇身上？

*/
/**
 *  Bug:
 *      1. 蛇头前面会有一个透明的块，而且这个块是不存在蛇身数组里面的，这导致蛇会在食物前一格就把食物吃掉
 *      2. 被吃掉的食物再次出现时没有判断是不是会出现在蛇身上，这样就会有直接食物出现在蛇身上的bug
 *      3. 蛇也没有设定蛇头碰到自己身体的判断，当蛇身长到足以拐弯碰到自己身体时，就会有bug
 */

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
    this.x = x;
	this.y = y;
	this.color = {
		snake: "#558B3A",
        food: "#FFB418",
        white: "#fff"
	};
    // 画canvas大小 
    this.id.width = this.x * this.cellWidth;
    // console.log(this.id.width);
    this.id.height = this.y * this.cellWidth;
    this.id.style.border = "1px solid black";

    this.setDirection();
}

Snake.prototype = {
    init: function() {
        this.snakeArr = [[0,parseInt(this.y/2)], [1,parseInt(this.y/2)]];    //蛇身长度。初始化时只有两个长度，每一个点存了[x,y]两个坐标,parseInt(this.y/2)是整个canvas的中间取整，length/push的是蛇头，unshift的是蛇尾
        this.foodPosition = []; //储存当前食物的位置,这里每次都初始化为0
        this.direction = 1;     //初始为1是向右走, 2下 3左  4上
        this.nextDirection = '';  //按键按了以后存到下一步,方向：右1，下2，左3，上4
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
        for(var i=1; i<snakeArr.length; i++){   //遍历蛇的长度，并画出来;通过snakeArr数组里的存的每一个坐标来画出不同的点
            this.drawRect(color.snake, snakeArr[i]);
        }
    },
    //初始化食物
    drawFood: function() {
		var color = this.color;
        this.foodPosition = [this.getRandom(this.x), this.getRandom(this.y)]; //随机方块的范围
        this.drawRect(color.food, this.foodPosition);  
        // console.log("pos"+pos);
        // console.log("foodPosition"+this.foodPosition);
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
        var area = this.getRectLeftTopCoordinate(pos);
        this.ctx.fillRect(area[0], area[1], this.cellWidth-1,this.cellWidth-1);    //从每个方块的左上边是坐标；比每个格子小1，就会自然的让每个方块之间有1的距离
    },

    /**蛇的移动
    *注意！！当moveSnake()加到了setTime()里面，this就不再指向Snake了，而是指向window
	* setInterval中的回调函数是在全局环境下调用的，因此this指向window
	* snakeHead蛇头位置，也是个[x,y]数组
	* 思路：把当前蛇头位置的x或y轴+1，然后重新堆入snakeArr尾巴，再把snakeArr的[0]消除,并在画蛇尾的时候，用白色，这样就会让之前画的方块看不见了，避免用clearRect来清除的麻烦，做到看似蛇在往前动的效果
	*/
    moveSnake: function(){
        // this.direction = this.nextDirection == ''?this.direction:this.nextDirection;  //直接这么写会比下面那样写好很多，不用重新把值赋值回去
		var color = this.color;
		var snakeArr = this.snakeArr;
        var snakeHead = this.snakeArr[this.snakeArr.length -1 ];
        var direction = this.direction;

        direction = this.nextDirection == ''?this.direction:this.nextDirection; //让蛇身走到当时蛇头的位置再拐  
        this.direction = direction;    //把局部变量的direction重新赋给this.direction变成全局的，让别的函数调用的this.direction的时候是现在改过的值
        //与三元表达式是一个效果
        // if(this.nextDirection == ""){
        //     direction = direction;
        // }else{
        //     direction = this.nextDirection;
        // }
        
        /*这里要判断方向的目的有两个：
            1. 初始运动方向
            2. 键盘事件让方向改变以后，还没有到达拐点nextDirection的像素点的走向
        */
        switch(direction){
            case 1: //右
                snakeHead = [snakeHead[0]+1, snakeHead[1]];
                break;
            case 2: //下
                snakeHead = [snakeHead[0], snakeHead[1]+1];
                break;
            case 3: //左
                snakeHead = [snakeHead[0]-1, snakeHead[1]];
                break;
            case 4: //上
                snakeHead = [snakeHead[0], snakeHead[1]-1];
                break;
            
        }

        //撞墙：
        //小问题:撞墙后要再走一格定时器才能停止
        if(snakeHead[0] === this.x+1 || snakeHead[0] === 0 || snakeHead[1] === this.y+1 || snakeHead[1] === 0){
            clearInterval(this.timer);
            alert("撞墙");
        }
        //吃食物
        if(snakeHead.toString() === this.foodPosition.toString()){
            // alert("snakeHead:"+snakeHead+"=="+"this.foodPosition:"+this.foodPosition);   
            // alert("吃了");
            this.drawFood();    //为什么蛇把食物吃掉，食物那一块就会自动加到蛇身上？
        }else{  //没吃得到食物就让蛇以现在蛇身的长度继续走
            var tail = snakeArr.shift();	//删除蛇尾(上一次的蛇尾，不是当前的蛇尾),当成一个参数传进去，才会保证数组一直是两个，直接把snakeArr.shift()放入drawRect数组里面会有三个数
		    this.drawRect(color.white, tail);	//用白色，这样可以掩盖之前画的蛇尾的颜色，避免用clearRect和save的麻烦
        }
		
		snakeArr.push(snakeHead);
		this.drawRect(color.snake,snakeHead);	//push以后一定在重新再画一下，不然没效果!
		
		// console.log("snakeHead = "+snakeHead);
        // console.log("tail = "+tail);
        // console.log("snakeArr = "+snakeArr);
        
        
    },

    //控制方向
    setDirection: function() {
        /*事件的回调函数的作用域是在#docunment下的，所以onkeydown的this指向的是#docunment而不是Snake实例
          这一点与setInterval是很像的，只不过setInterval是window提供的API，所以this是指向windos
          解决办法有二：
            1.声明一个变量保存this，回调函数中直接调用这个变量的方法
            2.使用箭头函数，自动绑定当前作用域的this
        */
        var that = this;    //this -> Snake实例
        //键盘按下事件
        document.onkeydown = function(e) {
            var keyCode;
            var direction = that.direction;
            // var nextDirection = that.nextDirection;
            keyCode = e.which;   //e.which指示哪个键被按下，给出该键的索引值（按键码）。
            // console.log(that);  //this -> #document
            switch(keyCode){
                case 39: //右
                    if(direction != 1 && direction != 3){   //防止按右键的时候依然向右或者向左反向移动
                        that.nextDirection = 1;
                    }    
                    break;
                case 40: //下
                    if(direction != 2 && direction != 4){
                        that.nextDirection = 2;
                    }
                    break;
                case 37: //左
                    if(direction != 3 && direction != 1){
                        that.nextDirection = 3;
                    }
                    break;
                case 38: //上
                    if(direction != 4 && direction != 2){
                        that.nextDirection = 4;
                    }
                    break;
                default:
                break;
            }
            // console.log(keyCode);
            // 问题：为啥nextDirection和that.nextDirection的结果不一样呢？！！ 答：作用域的问题和this不this没关系，var是局部作用，只改了这个function里面的值，全局的并没有被改掉
            // console.log("nextDirection:"+nextDirection);
            // console.log("that.nextDirection:"+that.nextDirection);
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
				that.moveSnake();			
			}, 180);
        })(this);
    },

    //生成随机正整数 1到n之间。
    getRandom: function (n){
        this.foodPosition.push(Math.floor(Math.random()*n+1));  //把坐标存入数组，就可以得到当前食物的坐标
        console.log(this.foodPosition); //这个食物坐标是错的,drawFood()里面的pos才是正确的食物坐标；但是为什么foodPosition和pos的数不一样，不明白
        return Math.floor(Math.random()*n+1);
    }
    
}

