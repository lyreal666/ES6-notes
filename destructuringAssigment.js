"use strict";

/**
 *18/4/1 宿舍
 */

//---------------array--------------------------//
// ES6以前
let arr = [1, 2, 3];
let a = arr[0], b = arr[1], c = arr[2];
//ES6
let [d, e, f] = [4, 5, 6];
console.log("" + d + e + f);
// 本质属于模式匹配

let [v1, v2, [v3, v4, [v5, v6]]] = [1, 2, [3, 4, [5, 6]]];
console.log("" + v1 + v2 + v3 + v4 + v5 + v6);

// 省略赋值
// py 做法
let [_, g] = [1, 2]; // _不建议使用
console.log(g);
// js

let [ , , h] = [1, 2, 3];
console.log(h);

let [, ...rest] = [1, 2, 3, 4, 6];
console.log(rest);

// 解构不成功
let [j, k, ...l] = [1];
console.log(k); // undefined
// 不完全解构
let [m, n] = [1, 2, 3];

// 左侧是数组形式的解构赋值，右侧要求是可迭代对象
// let [o] = 1, //TypeError: 1 is not iterable
//     [p] = "",
//     [q] = undefined,
//     [r] = null,
//     [s]= {};

// set 有iterator
let [t, u, v] = new Set(['a', 'b', 'c']);
console.log(t + u + v);

// 生成器也有iterator接口
// function* gnr() {
//     let a = 0,
//         b = 1;
//
//     while (true) {
//         yield a;
//         [a , b] = [b, a + b];
//     }
// }
//
// let [w, x, y] = gnr;
// console.log(w + y + z);

// 默认值
[a, b, c = 3] = [1, 2];
[e, f = true] = [4, undefined];
[h, ...j] = [1];
console.log(j);
// [g, ...rest = [1, 2, 3]] = [0]; SyntaxError: Invalid destructuring assignment target
console.log("" + c + f);

let func = () => {
    console.log("惰性求值");
};
[f=func()] = [];
// 相当于
{
    if ([][0] === undefined) {
        f = func();
    } else {
        f = [][0];
    }
}

// 解构赋值允许引用引用赋值中的其他变量
let [var1, var2 = var1] = [1]; // var2是1还是2?
console.log(var2); // 引用也是默认值
if (true) {

} else {
    xdd = "ggg"
}
let xdd; // 不报错,js很神奇，不运行不报错，很多运行时错

let [var3 = var4, var4] = [3, 4]; //居然不报错，有些错误可能与on公园不会检测出来
// let [var5 = var6, var6] = []; // ReferenceError: var6 is not defined


//----------------------对象----------------------------------//
let {foo, bar} = {foo: "aaa", bar: "bbb"};
console.log(foo + bar);

//和顺序无关
let {gnome, kde, baz} = {kde: "ubuntu", gnome: "centOs"};
console.log(kde + gnome + baz);

// 从对象取值本质是根据以下方式
let {ov1: ov1, ov2: ov2} = {ov1: "aaaa", ov2: "bbbb"};
// 根据左侧:前变量在右侧对象搜索后，把值赋值给左侧:后面的值
// 即:左侧是模式，右侧是变量

//嵌套形式
const node = {
    loc: {
        start: {
            line: 1,
            column: 5
        }
    }
};

let { loc, loc: {start}, loc: {start: {line}}} = node;
console.log(line);

//实例
let {log, sin, cos} = Math;


//--------------------------string--------------------------//
/**
 * 非对象类型数据进行结构赋值是会先转换为对象类型
 */
console.log('-------------------------------');
for (let c in "abcd") {
    console.log(c);
}
// 0, 1 , 2, 3
[a, b, c, d] = "abcd";
let {length: len} = "abcdefg";


//--------------------NUmber Boolean---------------------------//
let {toString:ts} = true;
console.log(ts === Boolean.prototype.toString);
let {toString: tsn} = 1;
console.log(tsn === Number.prototype.toString);
// null 和 undefine无法转换成对象 TypeError: Cannot destructure property `toString` of 'undefined' or 'null'.
// let {toString:tsnull} = null;
// let {toString:tsudf} = undefined;


//----------------------function---------------------------//
// 两个梨子
// 函数的参数是变量声明
/**
 * var是顶层作用域
 *
 */
function testFunc(arg1 = 4) {
    var arg2 = 4;

}
testFunc(5);
console.log(testFunc.arg2);
console.log(testFunc.arg1); // 声明了但是undefine
// console.log(arg3)// ReferenceError: arg3 is not defined
function demo1({x=0, y=1} = {}) {
    console.log([x, y]);
}
demo1(); // [ 0, 1 ] {}默认值无效

function demo2({x, y} = {}) {
    console.log([x, y]);
}
demo2(); // [ undefined, undefined ]


//圆括号问题
// 一句话，解构赋值不要用圆括号，因为会导致解释器解析错误


//-----------------------用途--------------------------------//
// 交换数据
// 原始方法
a = 1;
b = -1;

let tamp = a;
a = b;
b = tamp;
console.log("" + a + b);

// 现在
[a, b] = [b, a];
console.log("" + a + b);
/**分析
 * 解构赋值右侧指向的是数据原本，
 */

// 从函数返回多个值
function mutiRF() {
    return [true, false];
}

let [ , fa] = mutiRF();
console.log(fa);

// 作为函数参数
// 方便讲实参和变量名对应
function arrf([x, y, z]) {
    return [x, y, z];
}
arrf([5, 5, 5]);

function objF({x=0,y=2}) {
    return [x, y];
}
objF({});

// 从json提取数据
let json_str = {
    id: 43,
    status: "ok",
    retCode: 220
};

let {id, status, retCode} = json_str;
console.log(id + status + retCode);

// 遍历map
let mp = new Map([['mi', "雷军"], ['huawei', '任正非'],]);
for (let [k, y] of mp) {
    console.log(`${k}'s CEO is ${y}`);
}

// 输入模块
// import {m1, m2} from 'path';