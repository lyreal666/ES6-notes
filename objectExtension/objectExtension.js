'use strict';

/**
 * @author: ly
 * @file: objectExtension.js
 * @time: 2018/6/14 13:19
 * @desc:RS6对象扩展
 */

//----------------------属性的简洁表示-----------------------------//
let name = 'ly';
let study = () => {
    console.log("I'm study ES6...")
};
let student = {
    name,
    study,
    excise() { // 不需要function
        console.log("Excising is good for health")
    }
};
for (let key of Object.keys(student)) {
    console.log(`${key}: ${student[key]}`)
}
// 模板字符串函数转字符窜和console.log不一样
/*
name: ly
study: () => {
    console.log("I'm study ES6...")
}
excise: excise() {
        console.log("Excising is good for health")
    }
 */
console.log(student.study); // [Function: study]
console.log(student["study"]); // [Function: study]
student.excise(); // Excising is good for health

// 当属性名和变量名相同是构造对象相当方便
// 例如下面的函数返回值,nodejs的模块接口导出
let getPint = () => {
    let x = 0;
    let y = 0;
    return {x, y}
};


// 属性的getter,setter
let user = {
    _id: 0,
    get id() {
        console.log("getId");
        return this._id;
    },
    set id(newId) {
        console.log("setId");
        this._id = newId;
    }
};
user.id = 10086;
console.log(user.id);
/*
setId
getId
10086
 */

// 属性的简洁表示法变量总是被解析为字符串
let classObject = {
    class() {
        console.log("The class is a function, here is parsed to string")
    }
};
classObject.class(); // The class is a function, here is parsed to string

// 简洁表示生成器方法时加个*即可
let generatorObj = {
    *generatorFunc() {
        yield 0;
        yield 1;
    }
};

console.log(generatorObj.generatorFunc().next()); // { value: 0, done: false }


//----------------------属性名表达式--------------------------//
// 表示对象的属性
// ES5
let oneObj = {};
oneObj.name = 'oneObj';
oneObj['i' + 'd'] = 1024;

// ES6允许在对象字面值使用索引操作符声明对象属性,又叫属性名表达式
// 加强了在使用字面值形式对象定义属性时的灵活性,更方编
let propKey = 'name';
let attrNameExpObj = {
    [propKey]: 'ly'
};
console.log(attrNameExpObj.name);


// 属性名表达式如果接受的是非字符串会将其转换为字符串
const keyA = {a: 1};
const keyB = {b: 1};

let objObjectAsKey = {
    [keyA]: 'valueA',
    [keyB]: "valueB"
};
console.dir(objObjectAsKey); // { '[object Object]': 'valueB' } keyA被keyB覆盖

let nullKey = null;
let nullAsAtrrName = {
    [nullKey]: "nullAsKey"
};
console.dir(nullAsAtrrName); // { null: 'nullAsKey' }


//-------------------------object.is---------------------------------//
// ES5 判断相等
console.log(0.1 + 0.2 === 0.3); // false 严格相等运算符
console.log(' ' == false); // true 相等运算符,会自动转换

// 严格相等运算符不足
console.log(NaN === NaN); // false
console.log(+0 === -0); // true

// ES6提出视为同值相等的说法
// 和 === 大致相同,不同之处1.NaN等于NaN,+0不等于-0
console.log(Object.is('', false)); // false
console.log(Object.is(NaN, NaN)); // true
console.log(Object.is(+0, -0)); // false
console.log(+0 + (-0) === 0); // true


//------------------------assign------------------------------//
/**
 * assign用于将源对象的可枚举属性浅拷贝到目标对象,不包括继承的
 */
let target = {name: 'ly'};
target = Object.assign(target, Object.defineProperty({}, 'inVisible', {
    value: "can't be seen",
    enumerable: false
}));
console.log(Object.getOwnPropertyNames(target)); // [ 'name' ]
console.dir(target); // { name: 'ly' } inVisible不可枚举
console.log("inVisible" in target); // false
console.log(target.hasOwnProperty("inVisible")); // false
console.log(Object.getOwnPropertyDescriptor(target, "inVisible")); // undefined
console.log(Reflect.ownKeys(target));

// 一些特殊情况
// target 是非对象会被转换成对象
console.log(Object.assign(1, {name: 'ly'})); // { [Number: 1] name: 'ly' }
console.log(Object.assign('abc', {name: 'ly'})); // { [String: 'abc'] name: 'ly' }
// null,undefined无法转换为对象,如果作为target参数,报错
// console.log(Object.assign(null, {name: 'ly'})); // TypeError: Cannot convert undefined or null to object
// source也会被自动转换成对象,null,undefined会被跳过,除了字符串被转换成数组,其他的没有想过
console.log(Object.assign({}, 1, "abc", null, true)); // { '0': 'a', '1': 'b', '2': 'c' }

// 注意
// 1.浅拷贝

// 2.同名属性替换
console.log(Object.assign({}, {name: 'ly'}, {name: 'lyreal666'})); // { name: 'lyreal666' }
// 3.也可以用来合并数组
console.log(Object.assign([1, 2, 3], [2, 4, 5])); // [ 2, 4, 5 ]
// 4.取值函数不会被拷贝过去,会先取值再拷贝过去
const getterObj = {
    get id() {
        console.log('getId');
        return '1204'
    }
};
console.log(Object.assign({}, getterObj)); // getId { id: '1204' }

/*
常见用途
Object.assign方法有很多用处。

（1）为对象添加属性

class Point {
  constructor(x, y) {
    Object.assign(this, {x, y});
  }
}
上面方法通过Object.assign方法，将x属性和y属性添加到Point类的对象实例。

（2）为对象添加方法

Object.assign(SomeClass.prototype, {
  someMethod(arg1, arg2) {
    ···
  },
  anotherMethod() {
    ···
  }
});

// 等同于下面的写法
SomeClass.prototype.someMethod = function (arg1, arg2) {
  ···
};
SomeClass.prototype.anotherMethod = function () {
  ···
};
上面代码使用了对象属性的简洁表示法，直接将两个函数放在大括号中，再使用assign方法添加到SomeClass.prototype之中。

（3）克隆对象

function clone(origin) {
  return Object.assign({}, origin);
}
上面代码将原始对象拷贝到一个空对象，就得到了原始对象的克隆。

不过，采用这种方法克隆，只能克隆原始对象自身的值，不能克隆它继承的值。如果想要保持继承链，可以采用下面的代码。

function clone(origin) {
  let originProto = Object.getPrototypeOf(origin);
  return Object.assign(Object.create(originProto), origin);
}
（4）合并多个对象

将多个对象合并到某个对象。

const merge =
  (target, ...sources) => Object.assign(target, ...sources);
如果希望合并后返回一个新对象，可以改写上面函数，对一个空对象合并。

const merge =
  (...sources) => Object.assign({}, ...sources);
（5）为属性指定默认值

const DEFAULTS = {
  logLevel: 0,
  outputFormat: 'html'
};

function processContent(options) {
  options = Object.assign({}, DEFAULTS, options);
  console.log(options);
  // ...
}
上面代码中，DEFAULTS对象是默认值，options对象是用户提供的参数。Object.assign方法将DEFAULTS和options合并成一个新对象，如果两者有同名属性，则option的属性值会覆盖DEFAULTS的属性值。

注意，由于存在浅拷贝的问题，DEFAULTS对象和options对象的所有属性的值，最好都是简单类型，不要指向另一个对象。否则，DEFAULTS对象的该属性很可能不起作用。

const DEFAULTS = {
  url: {
    host: 'example.com',
    port: 7070
  },
};

processContent({ url: {port: 8000} })
// {
//   url: {port: 8000}
// }
上面代码的原意是将url.port改成 8000，url.host不变。实际结果却是options.url覆盖掉DEFAULTS.url，所以url.host就不存在了。
 */


//-----------------------------------遍历对象属性的5中方法------------------//
const testObj = Object.create({prototypeAttr: 'Attribute of prototype'}, {
    visible: {
        value: 'Visible attribute',
        enumerable: true
    },
    invisible: {
        value: 'Invisible attribute',
        enumerable: false
    },
    [Symbol('s1')]: {
        value: 's1',
        enumerable:true
    }
});

console.dir(testObj); // { visible: 'Visible attribute' }
// for in
for (let attr in testObj) {
    console.log(attr)
}
/*
visible
prototypeAttr
 */

// Object.keys
console.log(Object.keys(testObj)); // [ 'visible' ]

// Object.getOwnPropertyNames
console.log(Object.getOwnPropertyNames(testObj)); // [ 'visible', 'invisible' ]

// Object.getOwnPropertySymbols
console.log(Object.getOwnPropertySymbols(testObj)); // [ Symbol(s1) ]

// Reflect.ownKeys
console.log(Reflect.ownKeys(testObj)); // [ 'visible', 'invisible', Symbol(s1) ]

// 结论:
/*
1. 如果要遍历一个对象键,使用Object.keys而不是for in, 遍历继承来的属性一般没必要
2. 要遍历Symbol键,使用Object.getOwnPropertySymbols
3. Reflect是终极法宝
 */





