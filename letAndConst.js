"use strict";

/**
 * 1.let
 * 2.const
 * 3.global对象
 */

// let只在声明的代码块有效
{
    var a = 1;
    let b = 2;
}

console.log(a);
// console.log(b); // ReferenceError: b is not defined

// let很适合计数器形式for循环
for (let i = 0; i < 3; ++i) {
}
// console.log(i + 1); // ReferenceError: i is not defined


var farr = [];
for (var i = 0; i < 6; ++i) {
    farr.push(() => {
        console.log(i)
    });
}
farr[0](); // 输出6，函数对象保存的是i指向的内存的指针，调用函数时i已经变成6;

farr = [];
for (let i = 0; i < 6; ++i) {
    farr.push(() => {
        console.log(i)
    });
}
farr[0](); // 输出0,let定义的是块级作用域


let c = 1;
// let c = 2; // 重复申明SyntaxError: Identifier 'c' has already been declared
// 但是
for (let d = 0; ; ) {
    let d = 2;
    console.log(d); // 正常运行
    break;
}
// 正常运行说明循环体和for循环定义部分不是一个作用域


console.log(e); // 变量提升
var e = 0;

// console.log(f); // ReferenceError: f is not defined
let f = 0;


// 暂时性死区
var outVar = 0;
{
    console.log(outVar)
    // lei outVar;
    var outVar; // let 和 const声明的b变量所在区域,在声明之前都不能使用
}

// typeof不再绝对安全
console.log(typeof (x));
{
    // typeof (y);
    let y; // 声明前不能使用 y is not defined
}

// 一些比较隐蔽的暂时性死区
var bar = (x = y, y = 2) => {
    return [x, y];
}
// bar(); // ReferenceError: y is not defined,说明一个事实有些错误只有运行时才能检测

var x = x; // 不报错
// let y = y; // 报错，从右边计算到左边，取右边的y不成功


// let 不允许重复声明变量
var z = 1;
var z = 1; // 不报错

var p = 2;
// let p = 2; // Identifier 'p' has already been declared

let q = 0;
// let q = 2; // SyntaxError: Identifier 'q' has already been declared
function func(arg) {
    let arg = 3;
    console.log(arg);
}
// func(4); // 函数体内部的错误很多都是运行时才能检测 Identifier 'arg' has already been declared
// 让他们不再同一个作用域就可以声明同名的变量了
function func(arg) {
    {
        let arg = 3;
        console.log(arg);
    }
}
func()



//***********************为什么需要块级作用域******************************//
/**
 * Es5只存在两种作用域
 * 1.全局作用域
 * 2.函数作用域
 * 变量提升导致的内部覆盖外部变量
 */

var v = "out";
(function () {
    if (true) {
        console.log(v);
        var v = "in"
    }
})();
// 上面的等效于,函数作用域中变量声明提升到顶部
(function () {
    var v;
    if (true) {
        console.log(v);
        v = "in"
    }
})();

// 所以ES6以前定义一个函数时这样的
function add() {
    var a,
        b,
        c;
    a = 1;
    b = new Date();
    c = [];
}
// 函数最开始应该声明所有变量
/**
 * 理由:
 * 1.防止没有声明就使用
 * 2.符合事实，直观暴露变量提升带来的覆盖外部变量错误
 */

// 第二钟就是循环变量泄露
for (var i = 4; ;) {
    break;
}
console.log(i);

/**
 * ES6规定函数可以在块级最有用定义函数
 * ES5不允许
 * 但是ES6规定浏览器的实现可以有自己的实现
 */

// 浏览器行为类似于var, 可以通过，别的环境不是
// function browser() {
// }
// function test1() {
//     var browser = undefined; // 提升到顶级作用域覆盖外部
//     browser();
//     {
//         function browser() {
//
//         }
//     }
// }

function browser() {
}
function test1() {
    browser();
    {
        let browser = function () {
        }
    }
}
// 必须有大括号才允许声明块内函数
// 下面不通过
// if (true)
//     function () {
//
//     }
// webStorm有问题? 下面报错
// if (true) {
//     function () {
//
//     }
// }


//*************************const*******************************//
/**
 * const 相当于内部指针不允许改变的let，但指向的内存是可以改变的
 *
 */
const PI = 3.141592654;
// PI = 6.375; // TypeError: Assignment to constant variable.
const cobj = {
    var1: 2,
    var2: 2
}
// cobj = {}; // TypeError: Assignment to constant variable.
// cobj真的不能修改?
console.log(cobj.var1);
cobj.var1 = 3;
console.log(cobj.var1);

// 使用freeze函数返回将作为参数的对象冻结
let  obj1 = {
    var1: 1
}
Object.freeze(obj1); // 下面测试结果表明frwwze将原属性变成readonly返回原对象
// obj1.var1 = 3; // TypeError: Cannot assign to read only property 'var1' of object '#<Object>'
let obj5 = {var1: 1, var2: 2};
for (let attr in obj5) {
    console.log(obj5[attr]);
}

// 一个靠谱的冻结对象函数
var  constantize = (obj) => {
    Object.freeze(obj);
    for (let attr in obj) {
        console.log(attr);
        if (typeof obj[attr] === "object") {
            // arguments.callee(obj[attr]);
            constantize(obj[attr])
        }
    }
}

let obj3 = {
    var1: 1,
    var2: {
        var4: 4
    },
    var3: 4
}
constantize(obj3);
// obj3.var2.var4 = 5;
console.log(obj3.var2.var4);

//********************全局对像***************************//
/**
 * 6种声明变量的方法
 * var  function let const class import ES5只有前两者
 * browser 环境下global对象是window
 * webworker下是self
 * node下是global
 */
console.log(typeof global); // 返回object，说明是node下运行的

// ES6规定var 和 function 是自动绑定到全局对象上面的其他都不是
let n = "node";
console.log(global.n); // undefine

// 一种获取顶层对象的勉强方法
let getGlobal = () => {
    if (typeof window === "object") {
        return window;
    } else if (typeof global === "object") {
        return global;
    } else if (typeof self === "object") {
        return self;
    } else {
        throw new Error("can't find global object!");
    }
}

var go = getGlobal();
if (go === global) {
    console.log("node is topmost object");
}

// ES6 写法
// import getGlobal from "system.global";
// const global = getGlobal();





