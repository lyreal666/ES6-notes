/*
 * @Author: ytj 
 * @Date: 2018-07-17 22:39:07 
 * @Last Modified by: ytj
 * @Last Modified time: 2018-07-17 23:09:56
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
    constructor(x = 0, y = 0) {
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
class Example {
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

class Exp {
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
{
    let Father = class {
        fatherFunc() {}
    };

    let Son = class extends Father {
        sonFunc() {}
    }

    // 如果存在class提升,即Father 会在定义Father前使用,会报错
    new Son();
}


//--------------------------------------------private method--------------------------------------------//
// 使用#开头定属性为私有属性目前node还不支持
// class TestPrivateClass {
//     #name;

//     constructor(name='ly') {
//         #name = name;
//     }

//    get name() { return #name}
//    set name(newName) { #name = newName }
// }

// 常规方法
class NormalDefinePrivateProperty {
    constructor(name = 'ly') {
        this._name = name;
    }

    set name(newName) {
        this._name = newName
    }
    get name() {
        return this._name
    }
}

const normalDefinePrivateProperty = new NormalDefinePrivateProperty();
// set name
normalDefinePrivateProperty.name = 'ytj';
// get name
console.log(normalDefinePrivateProperty.name); // ytj

//--------------------------------------------this--------------------------------------------//
const ThisNotFound = class {
    constructor() {
        this.attr = 666
    }

    printAttr() {
        console.log(this.attr);
    }
}

let {
    printAttr
} = new ThisNotFound();
// printAttr() // TypeError: Cannot read property 'attr' of undefined

// resolution1 bind
const ThisIsFound = class {
    constructor() {
        this.attr = 666;
        this.printAttr = this.printAttr.bind(this);
    }

    printAttr() {
        console.log(this.attr);
    }
}

let {
    printAttr: printAttr1
} = new ThisIsFound();
printAttr1()

// resolution2  arrow function
class UseArrowFunction {
    constructor() {
        this.attr = 666;
        this.printAttr = () => {
            console.log(this.attr);
        }
    }


}

let {
    printAttr: printAttr2
} = new UseArrowFunction();
printAttr2();
console.log(UseArrowFunction.name); // UseArrowFunction

//--------------------------------------------getter and setter--------------------------------------------//
class GetterAndSetter {
    constructor(id) {
        this._id = id;
    }

    get id() {
        console.log('get id!');
        return this._id;
    }
    set id(newId) {
        console.log('set id');
        this._id = newId;
    }
}

const getterAndSetter = new GetterAndSetter();
console.log(getterAndSetter.id);
getterAndSetter.id = 888;
console.log(getterAndSetter.id);
// =>
// get id!
// undefined
// set id
// get id!
// 888

//--------------------------------------------Generator--------------------------------------------//
class ContainerGenerator {
    constructor(...args) {
        this.args = args;
    }

    * [Symbol.iterator]() {
        // forEach中不能使用yield
        // this.args.forEach((element, index, self) => {
        //     yield element
        // })
        
        for (let argument of this.args) {
            yield argument
        }
    }
}

for (let argument of new ContainerGenerator('I', 'love', 'a', 'girl')) {
    console.log(argument);
}


//--------------------------------------------static Method--------------------------------------------//
class ContainStaticMethod {

    
    // 静态属性肯定是没有用this的,因为静态属性绑定在类上面而不是实例上面
    static getLocaleTime() {
        // 静态方法中使用this调用this,这个this被绑定到了类上
        this.func();
        return new Date().toLocaleDateString();
    }
    
    static func() {
        console.log('static func');
    }
    
    // 静态方法可以和非静态方法同名
    func() {
        console.log('not static func');
    }

    callFunc() {
        this.func()
    }
}

let containStaticMethod = new ContainStaticMethod()
// containStaticProperty.getLocaleTime(); // TypeError: containStaticMethod.getLocaleTime is not a function

console.log(ContainStaticMethod.getLocaleTime()); // static func 2018-7-17
containStaticMethod.callFunc() // not static func

class Bar extends ContainStaticMethod {
    static func() {
        super.func()
    }
    
    // func() {
    //     super.callFunc()
    // }
}

// new Bar().func();

Bar.func(); // static func


//--------------------------------------------static property--------------------------------------------//
// node 不支持
// function testStaticProperty() {
//     class Foo {
//         static prop = 6;
//     }
// }

// testStaticProperty()


//--------------------------------------------new.target--------------------------------------------//
function testTargetOfNew() {
    // 构造函数中使用
    function Point(x=0, y=0) {
        console.log('abc');
        console.log(new.target);
        if (new.target) {
            this.x = x;
            this.y = y;
        } else {
            throw new Error('必须使用new来构造Point');
        }
    }

    new Point(); // abc [Function: Point]
    // Point(); // Error: 必须使用new来构造Point

    class Foo {
        constructor() {
            console.log(new.target);
            return new.target;
        }

        toString() {
            console.log('Foo');
        }
    }

    class Bar extends Foo {
        constructor() {
            super();
            console.log(new.target);
        }
        
        toString() {
            console.log('Bar');
        }
    }
    
    new Foo();
    console.log(Foo === new Foo()); // true

    new Bar(); // [Function: Bar] [Function: Bar]

    // 定义不可以实例化类, 只能被继承
    class CanBeDirectlyInstance {
        constructor() {
            if (new.target === CanBeDirectlyInstance) {
                throw new Error('该类不能被实例化');
            }

            this.fatherProp = 'abc';
        }
    }

    class A extends CanBeDirectlyInstance {
        constructor() {
            super();
            console.log(this.fatherProp);
        }
    }

    // new CanBeDirectlyInstance(); // Error: 该类不能被实例化
    new A(); // abc
}

testTargetOfNew();