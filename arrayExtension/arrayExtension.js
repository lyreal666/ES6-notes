'use strict';

/**
 * @author: ly
 * @file: arrayExtension.js
 * @time: 2018/6/12 18:08
 * @desc: ES6数组扩展
 */

//---------------------------扩展运算符------------------------------//
/**
 * 扩展运算符（spread）是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。
 */
let arr = [1, 2, 3, 4];
console.log(1, 2, 3, 4); // 1 2 3 4
console.log(...arr); // 1 2 3 4

let [a, ...b] =  [1, 2, 3, 4];
console.log(b);

/**
 * 用途:
 * 1. 当一个函数需要的多个参数刚好组成了一个数组时
 * 2. 用来构成新数组
 */

let debug = (...rest) => console.log(...rest);
debug("hello", "world"); // hello world

let oldArr = ['b', 'c', 'd'];
let newArr = ['a', ...oldArr, 'e'];
console.log(newArr); // [ 'a', 'b', 'c', 'd', 'e' ]

// 扩展运算符很灵活

// 后面可以接表达式
console.log(...('a' > 'A' ? ['a'] : []));

// 不能单行直接使用
// ...[1, 2, 3]; // SyntaxError: Unexpected number

// 对空数组扩展没有效果
console.log([1, ...[2, 3], ...[], 4]); // [ 1, 2, 3, 4 ]

// 测试
let student = {
    name: 'ly',
    age: 21
};
// TypeError: undefined is not a function
// console.log(...student);

let newStudent = {...student, grade: 2};
console.dir(newStudent); // { name: 'ly', age: 21, grade: 2 }

let set = new Set([2, 3, 4]);
console.log(...set); // 2 3 4
console.log([1, ...set, 5]); // [ 1, 2, 3, 4, 5 ]

/**
 * 结论:
 * 对象，set也可以用扩展运算符
 */


//----------------------替换函数的apply方法-------------------------//
/**
 * 函数的apply方法常用与将一个数组作为参数序列
 */
let digtalArr = [2, 1, 12, 3, 377];
console.log(Math.max.apply(null, digtalArr)); // Math.max不接受数组作为参数
console.log(Math.max([1, 3, 7])); // NaN,不接受非number类型参数


//----------------------------扩展运算符的应用-----------------------------//
/**
 * 复制数组
 */

// 测试
let arr1 = [2, 3, 4];
let arr2 = arr1;
arr1[0] = 9;
console.log(arr2[0]); // 9
arr1[0] = 2;

// ES5拷贝做法
let arr4 = arr1.slice(); //concat也行
arr1[0] = 9;
console.log(arr4[0]);
arr1[0] = 2;

// ES6拷贝做法
let arr3 = [...arr1];
arr1[0] = 9;
console.log(arr3[0]); // 2
// 或者
let [...arr5] = arr1;

/**
 * 数组的合并
 */
const array1 = ['x', 'y', 'z'];
const array2 = ['i', 'j', 'k'];

// ES合并
let array3 = array1.concat(array2);
console.log(array3); // [ 'x', 'y', 'z', 'i', 'j', 'k' ]
// ES6
array3 = [...array1, ...array2];


// 上面两种都是浅拷贝
// 证明:
let stuArr1 = [{name: 'ly'}, {name: 'jsq'}];
let stuArr2 = [...stuArr1];
console.log(stuArr1[0] === stuArr2[0]); // true

/**
 * 类似函数参数的声明
 * 在数组的解构赋值可以接受剩下的数组中元素,返回一个数组
 */
let [first, second, ...rest] = [1, 2, 3, 4, 5, 6];
console.log(`${first}-${second}-${rest}`); // 1-2-3,4,5,6
console.log(Array.isArray(rest)); // true

/**
 * 使用扩展运算符可以将字符串正确的转换为数组
 */
console.log([..."abcde"]); // [ 'a', 'b', 'c', 'd', 'e' ]

// 正确处理4字节字符
console.log('x\uD83D\uDE80y'.length );// 4
console.log([...'x\uD83D\uDE80y'].length); // 3
// 凡是涉及到操作四个字节的 Unicode 字符的函数，都有这个问题。因此，最好都用扩展运算符改写。

let str = 'x\uD83D\uDE80y';

console.log(str.split('').reverse().join('')); // y��x
// 'y\uDE80\uD83Dx'

console.log([...str].reverse().join('')); // y🚀x
// 'y\uD83D\uDE80x'
// 上面代码中，如果不用扩展运算符，字符串的reverse操作就不正确。

/**
 * 任何实现了Iterator接口的对象都可以用扩展运算符构成数组
 * 像前面的set
 * 又例如nodelist类数组
 */

/**
 * 生成器可以使用扩展运算符
 */
function *go() {
    yield 1;
    yield 2;
    yield 3
}

console.log([...go()]); // [ 1, 2, 3 ]
//变量go是一个 Generator 函数，执行后返回的是一个遍历器对象，对这个遍历器对象执行扩展运算符，就会将内部遍历得到的值，转为一个数组。
let arrx = [, ,];
for (let i of arrx) {
    console.log(1);
}


//----------------------Array.from--------------------------//
let likeArrayObj = {
    length: 3,
    name: 'ly',
    age: 19,
    1: 'abc'
};
console.log(Array.from(likeArrayObj)); // [ undefined, 'abc', undefined ]
/**
 * 和扩展运算符不一样,扩转运算符只能处理所有实现Symbol.iterator接口的对象
 * Array.from能转换任意对象
 */

console.log(Array.from({}));
// ES6的一个哼重要的特性就是实现接口的统一性
// 对于还没有部署该方法的浏览器，可以用Array.prototype.slice方法替代。

const toArray = (() =>
        Array.from ? Array.from : obj => [].slice.call(obj)
)();

/*

Array.from还可以接受第二个参数，作用类似于数组的map方法，用来对每个元素进行处理，将处理后的值放入返回的数组。

Array.from(arrayLike, x => x * x);
// 等同于
Array.from(arrayLike).map(x => x * x);

Array.from([1, 2, 3], (x) => x * x)
// [1, 4, 9]
下面的例子是取出一组 DOM 节点的文本内容。

let spans = document.querySelectorAll('span.name');

// map()
let names1 = Array.prototype.map.call(spans, s => s.textContent);

// Array.from()
let names2 = Array.from(spans, s => s.textContent)
下面的例子将数组中布尔值为false的成员转为0。

Array.from([1, , 2, , 3], (n) => n || 0)
// [1, 0, 2, 0, 3]
另一个例子是返回各种数据的类型。

function typesOf () {
    return Array.from(arguments, value => typeof value)
}
typesOf(null, [], NaN)
// ['object', 'object', 'number']
如果map函数里面用到了this关键字，还可以传入Array.from的第三个参数，用来绑定this。

Array.from()可以将各种值转为真正的数组，并且还提供map功能。这实际上意味着，只要有一个原始的数据结构，你就可以先对它的值进行处理，然后转成规范的数组结构，进而就可以使用数量众多的数组方法。

Array.from({ length: 2 }, () => 'jack')
// ['jack', 'jack']
上面代码中，Array.from的第一个参数指定了第二个参数运行的次数。这种特性可以让该方法的用法变得非常灵活。

Array.from()的另一个应用是，将字符串转为数组，然后返回字符串的长度。因为它能正确处理各种 Unicode 字符，可以避免 JavaScript 将大于\uFFFF的 Unicode 字符，算作两个字符的 bug。

function countSymbols(string) {
    return Array.from(string).length;
}

*/

//----------------------Array.of-------------------------------//
// 接受多个参数构成数组,比Array()行为更统一
console.log(Array(3));
console.log(Array(3, 4));
console.log(Array.of(3));
console.log(Array.of(3, 4));
/*
[ <3 empty items> ]
[ 3, 4 ]
[ 3 ]
[ 3, 4 ]
 */


//----------------------内部拷贝覆盖-------------------------------//
console.log([1, 2, 3, 4].copyWithin(0, 3, 4));
/*
[ 4, 2, 3, 4 ]
把从下标3开始到下标4前一个从下标0开始覆盖
 */


//------------------------find和findIndex--------------------------------//
/**
 * 是不是和some函数有点相似，只不过some返回的是true或false，find返回的是元素本身
 * 都可以接受第二个参数绑定回调函数this
 */
console.log([1, 2, 3, 4].indexOf(4)); // 3
console.log([1, NaN].indexOf(NaN)); // -1 无法处理NaN
console.log([6, 8, 9, NaN, 'bbc'].find(v => v === 8)); // 6
console.log([6, 8, 9, NaN, 'bbc'].findIndex(function(ele, index, self) {
    console.log(this.words);
    return Object.is(ele, NaN);
}, {words: "hello world"}));

// 测试
console.log(Object.is(NaN, NaN)); // true
console.log(Object.is(0, -0)); // false
console.log(Object.is('', false)); //false
// 结论:
// Object.is是加强版===


//-----------------------fill---------------------------//
console.log((Array(30).fill('*').join(''))); // ******************************
console.log(Array(20).fill(0).map((ele, index) => ++index));
// [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ]
// 不用fill会出现什么情况
console.log(Array(20).map((ele, index) => ++index)); // [ <20 empty items> ]
// map对数组的空位处理是直接跳过
// 后两个参数是填充的开始点和终点
console.log([1, 2, 3, 4].fill(6, 0, 4)); // [ 6, 6, 6, 6 ]


//----------------------entries,keys,values------------------------------//
// 注意: 返回的是迭代器,可以用for of 遍历
for (let index of ['a', 'b'].keys()) {
    console.log(index);
}
// for (let elem of ['a', 'b'].values()) {
//     console.log(elem);
// }
for (let [k, v] of ['a', 'b', 'c'].entries()) {
    console.log(`${k}: ${v}`)
}
// console.log(['a', 'b', 'c'].values());
console.log(go()); //生成器返回空对象


//----------------------------includes----------------------------------//
console.log([1, 2, 3, 4].includes(1)); // true
console.log([NaN, 2].includes(NaN)); // true
console.log([NaN, 1, 2].indexOf(2));
// 结论:indexof可以不用了

// Map 结构的has方法，是用来查找键名的，比如Map.prototype.has(key)、WeakMap.prototype.has(key)、
// Reflect.has(target, propertyKey)。

// Set 结构的has方法，是用来查找值的，比如Set.prototype.has(value)、WeakSet.prototype.has(value)。
let map = new Map([['a', 1], ['b', 2]]);
console.log(map.has('b')); // true


//------------------------------数组空位-----------------------------------------//
// 空位怎么计算个数
console.log([, , , , ,].length); // 5
// 逗号前有多少空位就有多少元素

/*
ES5 对空位的处理，已经很不一致了，大多数情况下会忽略空位。

forEach(), filter(), reduce(), every() 和some()都会跳过空位。
map()会跳过空位，但会保留这个值
join()和toString()会将空位视为undefined，而undefined和null会被处理成空字符串。
 */

// ES6 则是明确将空位转为undefined。
// 由于空位的处理规则非常不统一，所以建议避免出现空位。