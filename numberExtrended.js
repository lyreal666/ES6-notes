"use strict"

/**
 *
 */

varOut = 1;

let debug = console.log;

//-----------------------------八进制 和 二进制---------------------------------//
//ES6新增 0b / 0o 或大写形式表示二进制和八进制
let octalNum = 0o10;
let binNum = 0b10;
debug(octalNum + ' ' + binNum);

// 使用Number转换为10进制
debug(Number(octalNum));


//--------------------------Finite NaN-----------------------------------//
// ES5 全局方法
debug(isNaN(NaN)); // true
debug(isFinite(2)); // true
debug(isFinite(2E325)); // false

// ES6 为了更模块化,把方法添加到了Number, 而且判断更加严格
debug(isNaN('a')); // true 先转换
debug(Number.isNaN('')); // false 只对数值有效其他一律false

debug(isFinite('abc')); // false
debug(isFinite('InFinity')); // false
debug(isFinite('0')); // true
debug(Number.isFinite('2')); // false


//-------------------------parseInt parseFloat------------------------------//
// ES6 为了更模块化,把方法添加到了Number,行为完全一致
debug(Number.parseFloat('0.123abc'));
debug(Number.parseFloat(false));
debug(Number.parseInt('11.2 ', 2)); // 3


//-------------------isInteger--------------------//
debug(Number.isInteger(1.0));
debug(Number.isInteger(1.1));
debug(Number.isInteger(1));
debug(Number.isInteger(0.0));

// 2个特殊情况
// 转换后的精度位数高于53位
debug(Number.isInteger(1.000000000000000000001)); // 这个1转换后超过了53位，被舍弃
debug(Number.isInteger(5E-325)); // 太接近0了,被视作0

// 结论: 对精度要求不高可以用


//----------------------epsilon 小量----------------------------//
/**
 * 2的-52放实际上是javaScript能表示的最小精度
 * 所以误差范围小于它可以被认为没误差
 */
debug('------------------')
debug(Number.EPSILON === Math.pow(2, -52)); // true
debug(0.1 + 0.2 === 0.3); // false

let isEqual = (left, right) => {
    return Math.abs(left - right) < Number.EPSILON * Math.pow(2, 2);
};

debug(isEqual(0.1 + 0.2, 0.3)); // true
debug(isEqual(0.3 + 0.6, 0.9)); // true


//----------------------isSafeInteger------------------//
debug(Math.pow(2, 53));
debug(Math.pow(2, 53) === Math.pow(2, 53) + 1); // 最大存储2的53次方

debug(Math.pow(2, 53) - 1 === Number.MAX_SAFE_INTEGER); // true
debug(-Math.pow(2, 53) + 1 === Number.MIN_SAFE_INTEGER); // true

let isSafeOp = (left, right, result) => {
    if (
        Number.isSafeInteger(left) &&
        Number.isSafeInteger(right) &&
        Number.isSafeInteger(result)
    ) {
        return result;
    }
    throw new RangeError('Operation cannot be trusted!');
};
debug(Number.isSafeInteger(Math.pow(2, 53) + 1)); // false

// debug(isSafeOp(9007199254740993, 990, 9007199254740993 - 990));
// RangeError: Operation cannot be trusted!

debug(isSafeOp(1, 2, 3));
// 3


//----------------------------Math 扩展----------------------//
// truncated(截取) 取整 会自动转换
debug(Math.trunc(0.1)); // 0
debug(Math.trunc(-1.2)); // -1
debug(Math.trunc(-0.1)); // -0
debug(Math.trunc(undefined)); // NaN

let getInt = (fNum) => fNum < 0 ? Math.ceil(fNum) : Math.floor(fNum);
debug(getInt(-0.3)); // =0

// sign 取符号
debug(Math.sign(-0)); // -0
debug(Math.sign(0)); // 0
debug(Math.sign(5.0)); // 1
debug(Math.sign(-3.0)); // -1
debug(Math.sign('asgalg')); // NaN

// 对于没有部署这个方法的环境，可以用下面的代码模拟。

Math.sign = Math.sign || function(x) {
    x = +x; // convert to a number
    if (x === 0 || isNaN(x)) {
        return x;
    }
    return x > 0 ? 1 : -1;
};

// cbrt cubic root
debug(Math.cbrt(0)); // 0
debug(Math.cbrt(-0)); // -0
debug(Math.cbrt(-1)); // -1
debug(Math.cbrt(8)); // 2
debug(Math.cbrt("jsklak")); // NaN

Math.sign = Math.sign || function(x) {
    x = +x; // convert to a number
    if (x === 0 || isNaN(x)) {
        return x;
    }
    return x > 0 ? 1 : -1;
};

// hypot 返回所有参数的平方和的平方根
debug(Math.hypot(3, 4)); // 5
debug(Math.hypot(5, 12)); // 13

// 对数
debug(Math.exp(1)); // 2.718281828459045 求e的x次方
debug(Math.expm1(1)); // 1.718281828459045 e ^ x - 1
debug(Math.log(Math.exp(1))); // 1
debug(Math.log1p(Math.exp(1) - 1)); // 1
debug(Math.log10(1000)); // 3
debug(Math.log2(8)); // 3

// ** 求幂
debug(2 ** 3); // 8
let a = 3;
a **= 3;
debug(a); // 27

//注意，在 V8 引擎中，指数运算符与Math.pow的实现不相同，对于特别大的运算结果，两者会有细微的差异。
Math.pow(99, 99)
// 3.697296376497263e+197
99 ** 99
// 3.697296376497268e+197
//上面代码中，两个运算结果的最后一位有效数字是有差异的。

// 以下觉得没什么用
// Math.clz32()
// JavaScript 的整数使用 32 位二进制形式表示，Math.clz32方法返回一个数的 32 位无符号整数形式有多少个前导 0。
//
// Math.clz32(0) // 32
// Math.clz32(1) // 31
// Math.clz32(1000) // 22
// Math.clz32(0b01000000000000000000000000000000) // 1
// Math.clz32(0b00100000000000000000000000000000) // 2
// 上面代码中，0 的二进制形式全为 0，所以有 32 个前导 0；1 的二进制形式是0b1，只占 1 位，所以 32 位之中有 31 个前导 0；1000 的二进制形式是0b1111101000，一共有 10 位，所以 32 位之中有 22 个前导 0。
//
// clz32这个函数名就来自”count leading zero bits in 32-bit binary representation of a number“（计算一个数的 32 位二进制形式的前导 0 的个数）的缩写。
//
// 左移运算符（<<）与Math.clz32方法直接相关。
//
// Math.clz32(0) // 32
// Math.clz32(1) // 31
// Math.clz32(1 << 1) // 30
// Math.clz32(1 << 2) // 29
// Math.clz32(1 << 29) // 2
// 对于小数，Math.clz32方法只考虑整数部分。
//
// Math.clz32(3.2) // 30
// Math.clz32(3.9) // 30
// 对于空值或其他类型的值，Math.clz32方法会将它们先转为数值，然后再计算。
//
// Math.clz32() // 32
// Math.clz32(NaN) // 32
// Math.clz32(Infinity) // 32
// Math.clz32(null) // 32
// Math.clz32('foo') // 32
// Math.clz32([]) // 32
// Math.clz32({}) // 32
// Math.clz32(true) // 31
// Math.imul()
// Math.imul方法返回两个数以 32 位带符号整数形式相乘的结果，返回的也是一个 32 位的带符号整数。
//
// Math.imul(2, 4)   // 8
// Math.imul(-1, 8)  // -8
// Math.imul(-2, -2) // 4
// 如果只考虑最后 32 位，大多数情况下，Math.imul(a, b)与a * b的结果是相同的，即该方法等同于(a * b)|0的效果（超过 32 位的部分溢出）。之所以需要部署这个方法，是因为 JavaScript 有精度限制，超过 2 的 53 次方的值无法精确表示。这就是说，对于那些很大的数的乘法，低位数值往往都是不精确的，Math.imul方法可以返回正确的低位数值。
//
// (0x7fffffff * 0x7fffffff)|0 // 0
// 上面这个乘法算式，返回结果为 0。但是由于这两个二进制数的最低位都是 1，所以这个结果肯定是不正确的，因为根据二进制乘法，计算结果的二进制最低位应该也是 1。这个错误就是因为它们的乘积超过了 2 的 53 次方，JavaScript 无法保存额外的精度，就把低位的值都变成了 0。Math.imul方法可以返回正确的值 1。
//
// Math.imul(0x7fffffff, 0x7fffffff) // 1
// Math.fround()
// Math.fround方法返回一个数的32位单精度浮点数形式。
//
// 对于32位单精度格式来说，数值精度是24个二进制位（1 位隐藏位与 23 位有效位），所以对于 -224 至 224 之间的整数（不含两个端点），返回结果与参数本身一致。
//
// Math.fround(0)   // 0
// Math.fround(1)   // 1
// Math.fround(2 ** 24 - 1)   // 16777215
// 如果参数的绝对值大于 224，返回的结果便开始丢失精度。
//
// Math.fround(2 ** 24)       // 16777216
// Math.fround(2 ** 24 + 1)   // 16777216
// Math.fround方法的主要作用，是将64位双精度浮点数转为32位单精度浮点数。如果小数的精度超过24个二进制位，返回值就会不同于原值，否则返回值不变（即与64位双精度值一致）。
//
// // 未丢失有效精度
// Math.fround(1.125) // 1.125
// Math.fround(7.25)  // 7.25
//
// // 丢失精度
// Math.fround(0.3)   // 0.30000001192092896
// Math.fround(0.7)   // 0.699999988079071
// Math.fround(1.0000000123) // 1
// 对于 NaN 和 Infinity，此方法返回原值。对于其它类型的非数值，Math.fround 方法会先将其转为数值，再返回单精度浮点数。
//
// Math.fround(NaN)      // NaN
// Math.fround(Infinity) // Infinity
//
// Math.fround('5')      // 5
// Math.fround(true)     // 1
// Math.fround(null)     // 0
// Math.fround([])       // 0
// Math.fround({})       // NaN
// 对于没有部署这个方法的环境，可以用下面的代码模拟。
//
// Math.fround = Math.fround || function (x) {
//     return new Float32Array([x])[0];
// };