参考：
 https://github.com/liusaint/games/tree/master/snake

 
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
 *      2. 被吃掉的食物再次出现时没有判断是不是是不是会出现在蛇身上，这样就会有直接食物出现在蛇身上的bug
 *      3. 蛇也没有设定蛇头碰到自己身体的判断，当蛇身长到足以拐弯碰到自己身体时，就会有bug
 */