// "use strict"

/**
*
*/

let debug = console.log;

//-------------------------default value----------------------------//
// ES5
function func1(x) {
    x = x || 'default';
    debug(x);
}

func1();
func1(false); // default 局限性
func1(null);  // default
func1(undefined); // default

//ES6
let myPow = (x, y=2) => {
    return Math.pow(x, y);
};

debug(myPow(4));

/**
 * 好处
 * 1.可以明显看出哪些参数时可以用默认值，不需要看函数体
 * 2.有利于将来的代码优化，即使未来的版本在对外接口中，彻底拿掉这个参数，也不会导致以前的代码无法运行。
 */

/*注意点*/

// 参数是默认声明的不允许用const,let再次声明
// let testFunc = (x, y=0) => {
//     let x = 1; // Identifier 'x' has already been declared
//     const y = 3; // Identifier 'y' has already been declared
// };

// 惰性求值
let x = 0;
function foo(p = x + 10) {
    debug(p);
}
foo();
x = -10;
foo();

// 一般把有默认值的参数放在尾部，这样就不用写那些参数，放前面其实是不能省的
function  funcIngore(x=0, y){
    debug([x, y]);
}

funcIngore(1);
// funcIngore( , 2); // SyntaxError: Unexpected token ,不能省，要省放后面去
funcIngore(null, 2); // [ null, 2 ]
funcIngore(undefined, 2); // [ 0, 2 ] 只有undefine可以触发默认值

// 函数length属性
function funcLen(x, y, v, w=5) {
    let z = 0;
    const k = 0;
}

function funclen1(x, y, z=0, w){
    debug('a');
}
debug(funcLen.length); // 3 返回的是参数个数--默认值参数前面的参数，后面的不计入length
debug(funclen1.length); // 2
// rest参数也不计入
function funcRest(x, ...rest) {}
debug(funcRest.length); // 1

// 同一个作用域 多次声明同一个变量，只要有一次let，报错
var t = 2;
var t = 1;
// let t = 5;

let c = 4;
// function fc(c=c) { // let c = c
// }
// fc()

// 默认值的应用
// 保证参数没有被省咧
function throwIfMissing() {
    throw new Error('Missing a argument!');
}

function cannotIngore(x, y=throwIfMissing()) {}

// 提示用户该参数可以省略
function canIngore(x, y=undefined) {}54


//----------------------rest 参数-------------------------//
/**
 * rest和arguments区别
 * rest是真正的数组，可以直接调用数组的方法
 * 幽灵rest就不需用arguments
 *  rest数组内参数不计入length
 */

function argFunc() {
    return Array.prototype.slice.call(arguments).sort();
}

debug(argFunc(2, 5, 3));

let restFunc = (...numbers) => {
    return numbers.sort()
};

debug(restFunc(3, 11, 9));


//----------------------严格模式-----------------------//
// ES5允许在函数内部使用strict
variab = 8;
function strFunc() {
    "use strict";
    let variabb = 6; // ReferenceError: variabb is not defined
}
strFunc();

// ES6规定，如果在函数参数中使用了如默认值，rest，, 结构赋值，捕鱼不许内部声明严格模式
/**
 * 理由:
 * 函数内部的严格模式，同时适用于函数体和函数参数。
 * 但是，函数执行的时候，先执行函数参数，然后再执行函数体。
 * 这样就有一个不合理的地方，只有从函数体之中，才能知道参数是否应该以严格模式执行，
 * 但是参数却应该先于函数体执行。
 */
// 咱又想在函数体内部使用strict有想使用参数高级语法咋办
// 俩种破除限制的方法
// 设置全局strict
// 用立即执行函数
let breakLimit = (() => {
    aaa = 8;
    'use strict';
    return (...rest) => {
        // bbbb = 9; // ReferenceError: bbbb is not defined
        debug('ok');
    };
})();
breakLimit();


//-------------name----------------/
// 具名函数
function name1() {}
debug(name1.name); // name1

let _name1 = name1;
debug(_name1.name); // name1

// 函数表达式
let name2 = () => {};
debug(name2.name); // name2
let _name2 = name2;
debug(_name2.name); // name2

// 匿名函数
debug((() => {}).name); // ''
debug((function () {}).name); // ''
// Function构造函数
debug((new Function).name); // anonymous

let bname2 = name2.bind({});
debug(bname2.name); // bound name2
/**
 * 总结name属性
 * 匿名函数返回空字符串
 * 通过变量名获取的name是匿名函数第一次绑定的变量名
 * 使用bind绑定后，name有bound前缀
 */


//----------------------arrow function-------------------------//
// ES6新增加箭头函数
// 使用场景
// 函数体语句比较少的函数
let add = (a, b) => a + b ;
// 作为回调函数
debug([4, 11, 6].sort((x, y) => x - y));

// 注意事项
// 箭头函数没有自己的this,只能调用外部的this
function foo() {
    setTimeout(() => {
        console.log('id:', this.id);
    }, 100);
}

var id = 21;


foo.call({ id: 42 });






