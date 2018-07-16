/*
 * @Author: ytj 
 * @Date: 2018-07-16 20:32:32 
 * @Last Modified by: ytj
 * @Last Modified time: 2018-07-16 23:26:18
 */

'use strict'; 

/*
* ES6 class basic grammar
*/

// 类和模块内部默认就是严格模式,基本上未来都是在模块内写代码,
// 所以ES6实际上把整个语言升级到了严格模式

//-----------------------------gettingStarted-----------------------------------//

// ES5
function testES5ConstructorFunction() {
    function Point(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    
    Point.prototype.toString = function () {
        return '(' + this.x + ', ' + this.y + ')';
    };
    
    console.log(new Point());
    let point6 = new Point(6, 6);
    console.log('Point.name:', Point.name);
    console.log(new Point(6, 6));
    // =>
    // Point { x: 0, y: 0 }
    // Point.name: Point
    // Point { x: 6, y: 6 }
}
testES5ConstructorFunction();

// ES6
class Point {
    constructor(x=0, y=0) {
        this.x = x;
        this.y = y;
    }
    // 不能用`,`号隔开
    
    toString() {
        return `(${this.x}, ${this.y}`;
    }
}

let point = new Point();
console.log(point);

// let _point = Point(); // TypeError: Class constructor Point cannot be invoked without 'new'

// no difference compare to ES5 constructor function
console.log(typeof Point); // function

// the same to ES5
console.log(Point === Point.prototype.constructor); // true

// 类里面所有的方法都被定义到类的原型上面
// 默认产生constructor() {}
class Point1 {
    func1() {

    }
    
    func2() {

    }

}
// up the same to bottom
// Point1.prototype = {
//     constructor() {},
//     func1() {},
//     func2() {}
// }

let point1 = new Point1();
console.log(point1.func1 === Point1.prototype.func1); // true

// class 内部定义在class.prototype上面的属性默认是不可遍历的
console.log(Object.keys(point1.__proto__)); // []
console.log(Object.keys(Point1.prototype)); // []
console.log(Point1.prototype === point1.__proto__); // true
console.log(Object.getOwnPropertyNames(Point1.prototype)); // [ 'constructor', 'func1', 'func2' ]
console.log(Object.getOwnPropertyDescriptor(Point1.prototype, 'func1'));
// =>
// { value: [Function: func1],
//     writable: true,
//     enumerable: false,
//     configurable: true }


//----------------------------------constructor-----------------------------------//
class Example{
    constructor() {
        // 返回的值就是new Example返回, 默认返回的对象为this
        return Object.create(null);
    }
    
    func1() {}
}

console.log(new Example() instanceof Example); // false


//------------------------------instance---------------------------------------//

// 实例对象默认只有__proto__ 指向其构造函数的prototype, 实际环境__proto__不一定存在,建议使用ES6的Object.getPrototypeOf代替
// 在构造函数和类中所有绑定在this上面的属性才会绑定在实例对象上面
// 直接声明的函数和属性绑定在原型上
// 同一个类的所实例对共享一个实例对象,即他们的__proto_相等

class Exp{
    func1() {}
}

const exp1 = new Exp();
const exp2 = new Exp;

console.log(Object.getPrototypeOf(exp1)); // Exp {}
console.log(exp1.__proto__ === Exp.prototype); // true
console.log(exp1.__proto__ === exp2.__proto__); // true


//--------------------------------class exp----------------------------------------//
let ClassExpression;
module.exports = ClassExpression = class Me {
    // className is also can be ignored to be a anonymous class
    printName() {
        console.log(Me.name);
    }
}

new ClassExpression().printName(); // Me

// 很奇怪哈,Me 只能在内部使用
// new Me(); // ReferenceError: Me is not defined

// 立即执行类
let aImmediateInstance = new class {
    func() {}
}();

//----------------------------------------变量提升------------------------------------------------//
// hoist