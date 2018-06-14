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




