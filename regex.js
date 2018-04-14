"use strict";

/**
 *
 */

let debug = console.log;

//------------------------构造函数--------------------//
// ES5
let regexp1 = new RegExp('\\d+', 'g');
let regexp2 = new RegExp(/\d+/g); // 第一个参数时正则表达式对象时,没有第二个参数
// ES6
let regexp3 = new RegExp(/\d+/g, 'iy'); // ES6允许第二个参数再次指定匹配模式
debug(regexp3.flags); // => iy 第二个参数会覆盖原有对象匹配模式


//--------------unicode 模式-----------------------------、、
// 4字节字符将被视作一个字符
debug('𠮷'.codePointAt(0).toString(16)); // 20bb7
debug('𠮷'.charCodeAt(0).toString(16) + ' ' + '𠮷'.charCodeAt(1).toString(16)); // d842 dfb7
debug('\ud842\udfb7'); // 𠮷
// ES5 四字节字符应该被视为一个字符，下面的结果先让不合理
debug(/\ud842/.test('\ud842\udfb7')); // true
// ES6
debug(/\ud842/u.test('\ud842\udfb7')); // false

// 4点u模式带来的行为改变

// u 匹配模式下正则表达式中表示除了换行符的任意字符的.可以匹配4字节字符
debug(/^.$/.test('𠮷')); // false
debug(/^.$/u.test('𠮷')); // true

// 使用u模式, unicode字符大括号表示法的大括号才会被正确识别，否则会被识别为量词
debug(/\u{61}/.test('a')); // false 内识别为61个\u
debug(/\u{61}/u.test('a')); // true 正确识别
debug(/\u0061/u.test('a')); // true

// 量词会正确识别所量化的字符
debug(/\ud842\udfb7{2}/.test('\ud842\udfb7\ud842\udfb7')); // false, 识别为2个\udfb7
debug(/\ud842\udfb7{2}/u.test('\ud842\udfb7\ud842\udfb7')); // true, 识别为两个\ud842\udfb7

// \S能匹配4bytes字符
debug('123'.match(/\d/g)); // [ '1', '2', '3' ]
let getLength = (text) => text.match(/[\s\S]/gu).length; // \S匹配非空字符
debug(getLength('a c    b d ')); // 11
debug('𠮷𠮷'.match(/\S/g).length); // 4
debug(getLength('𠮷𠮷')); // 2

// 能正确识别码点不同但字形相近的字符 \u004B 和\u212a都是K
debug('\u004b \u212a');
debug(/[a-z]/i.test('\u212a')); // false
debug(/[a-z]/iu.test('\u212a')); // true 不加u无法识别不规范的K


//------------------------y 黏连模式-----------------------------//
let regexp4 = /\d\d\d/gu;
debug(regexp4.exec('111 222 333')); // [ '111', index: 0, input: '111 222 333' ]
debug(regexp4.exec('111 222 333')); // [ '222', index: 4, input: '111 222 333' ]
debug(regexp4.exec('111 222 333')); // [ '333', index: 8, input: '111 222 333' ]

// y模式
let regexp5 = /\d\d\d/gyu;
debug(regexp5.exec('111 222 333')); // [ '111', index: 0, input: '111 222 333' ]
debug(regexp5.exec('111 222 333')); // null

// 来个对比
debug(/\d\d\d/gu.exec('a 123')); // [ '123', index: 2, input: 'a 123' ]
debug(/\d\d\d/guy.exec('a 123')); // null
/**
 * g模式表示每次都从当前lastIndex匹配
 * y模式隐含^
 * 相当于全局匹配中每次^生效
 */

let regexp6 = /^\d\d\d/gu;
debug('---------------regexp6---------------')
debug(regexp6.exec('111 222 333')); // [ '111', index: 0, input: '111 222 333' ]
debug(regexp6.exec('111 222 333')); // null

// y修饰符的一个应用，是从字符串提取 token（词元），y修饰符确保了匹配之间不会有漏掉的字符。

const TOKEN_Y = /\s*(\+|[0-9]+)\s*/y;
const TOKEN_G  = /\s*(\+|[0-9]+)\s*/g;

tokenize(TOKEN_Y, '3 + 4')
// [ '3', '+', '4' ]
tokenize(TOKEN_G, '3 + 4')
// [ '3', '+', '4' ]

function tokenize(TOKEN_REGEX, str) {
    let result = [];
    let match;
    while (match = TOKEN_REGEX.exec(str)) {
        result.push(match[1]);
    }
    return result;
}


//---------------------some attributes--------------------------//
debug(/\d/iguy.flags); // giuy
debug(/\d/igu.sticky); // false
debug(/\d/iguy.sticky); // true


//-------------------------dotAll 模式-------------------------//
/**
 * .号有两种字符不能直接表示
 * 4字节字符通过u解决
 * 行终止符通过s解决
 */

debug(/^.$/.test('\n')); // false
debug(/^.$/s.test('\n')); //true


//---------------------------断言--------------------------------------//
// 先行: 扫描引擎会尝试匹配扫描指针后面的字符
// 先行断言
debug('25% is smaller than 30 percent'.match(/\d+(?=%)/g)); // [ '25' ]

// 先行否定断言
debug('25% is smaller than 30 percent'.match(/\d\d(?!%)/g)); // [ '30' ]

// 后行: 扫描引擎尝试匹配匹配指针后面的字符
// debug(/(?<=\$)var/g.exec('$var is a var')); // [ 'var', index: 1, input: '$var is a var' ]
// debug(/(?<!\$)var/g.exec('$var is a var')); // [ 'var', index: 10, input: '$var is a var' ]

// 后行断言的组匹配，与正常情况下结果是不一样的。

// /(?<=(\d+)(\d+))$/.exec('1053') // ["", "1", "053"];
// /^(\d+)(\d+)$/.exec('1053') // ["1053", "105", "3"];

// 其次，“后行断言”的反斜杠引用，也与通常的顺序相反，必须放在对应的那个括号之前。
//
// /(?<=(o)d\1)r/.exec('hodor')  // null
// /(?<=\1d(o))r/.exec('hodor')  // ["r", "o"]

debug(/(\d)/.exec('1')); // regexp最外层不要加括号


//-------------------- Unicode 类-------------------------//
/**
 * 使用\p{} 或\P{}形式的类配合正则表达式
 * 由于Unicode类有很多属性是的这种形式的正则表达式非常强大
 */
// const uregexp = /\p{Script=Greek}/u;
// debug(uregexp.exec('∏'));
// ES2018 引入了一种新的类的写法\p{...}和\P{...}，允许正则表达式匹配符合 Unicode 某种属性的所有字符。
//
// const regexGreekSymbol = /\p{Script=Greek}/u;
// regexGreekSymbol.test('π') // true
// 上面代码中，\p{Script=Greek}指定匹配一个希腊文字母，所以匹配π成功。
//
// Unicode 属性类要指定属性名和属性值。
//
// \p{UnicodePropertyName=UnicodePropertyValue}
// 对于某些属性，可以只写属性名，或者只写属性值。
//
// \p{UnicodePropertyName}
// \p{UnicodePropertyValue}
// \P{…}是\p{…}的反向匹配，即匹配不满足条件的字符。
//
// 注意，这两种类只对 Unicode 有效，所以使用的时候一定要加上u修饰符。如果不加u修饰符，正则表达式使用\p和\P会报错，ECMAScript 预留了这两个类。
//
// 由于 Unicode 的各种属性非常多，所以这种新的类的表达能力非常强。
//
// const regex = /^\p{Decimal_Number}+$/u;
// regex.test('𝟏𝟐𝟑𝟜𝟝𝟞𝟩𝟪𝟫𝟬𝟭𝟮𝟯𝟺𝟻𝟼') // true
// 上面代码中，属性类指定匹配所有十进制字符，可以看到各种字型的十进制字符都会匹配成功。
//
// \p{Number}甚至能匹配罗马数字。
//
// // 匹配所有数字
// const regex = /^\p{Number}+$/u;
// regex.test('²³¹¼½¾') // true
// regex.test('㉛㉜㉝') // true
// regex.test('ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫ') // true
// 下面是其他一些例子。
//
// // 匹配所有空格
// \p{White_Space}
//
// // 匹配各种文字的所有字母，等同于 Unicode 版的 \w
// [\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Connector_Punctuation}\p{Join_Control}]
//
// // 匹配各种文字的所有非字母的字符，等同于 Unicode 版的 \W
// [^\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Connector_Punctuation}\p{Join_Control}]
//
// // 匹配 Emoji
// /\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu
//
// // 匹配所有的箭头字符
// const regexArrows = /^\p{Block=Arrows}+$/u;
// regexArrows.test('←↑→↓↔↕↖↗↘↙⇏⇐⇑⇒⇓⇔⇕⇖⇗⇘⇙⇧⇩') // true


//---------------------------具名组匹配---------------------------------//
// let res = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{4})/.exec('1998-01-27');
// debug(res);
// 正则表达式使用圆括号进行组匹配。
//
// const RE_DATE = /(\d{4})-(\d{2})-(\d{2})/;
// 上面代码中，正则表达式里面有三组圆括号。使用exec方法，就可以将这三组匹配结果提取出来。
//
// const RE_DATE = /(\d{4})-(\d{2})-(\d{2})/;
//
// const matchObj = RE_DATE.exec('1999-12-31');
// const year = matchObj[1]; // 1999
// const month = matchObj[2]; // 12
// const day = matchObj[3]; // 31
// 组匹配的一个问题是，每一组的匹配含义不容易看出来，而且只能用数字序号（比如matchObj[1]）引用，要是组的顺序变了，引用的时候就必须修改序号。
//
// ES2018 引入了具名组匹配（Named Capture Groups），允许为每一个组匹配指定一个名字，既便于阅读代码，又便于引用。
//
// const RE_DATE = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
//
// const matchObj = RE_DATE.exec('1999-12-31');
// const year = matchObj.groups.year; // 1999
// const month = matchObj.groups.month; // 12
// const day = matchObj.groups.day; // 31
// 上面代码中，“具名组匹配”在圆括号内部，模式的头部添加“问号 + 尖括号 + 组名”（?<year>），然后就可以在exec方法返回结果的groups属性上引用该组名。同时，数字序号（matchObj[1]）依然有效。
//
// 具名组匹配等于为每一组匹配加上了 ID，便于描述匹配的目的。如果组的顺序变了，也不用改变匹配后的处理代码。
//
// 如果具名组没有匹配，那么对应的groups对象属性会是undefined。
//
// const RE_OPT_A = /^(?<as>a+)?$/;
// const matchObj = RE_OPT_A.exec('');
//
// matchObj.groups.as // undefined
// 'as' in matchObj.groups // true
// 上面代码中，具名组as没有找到匹配，那么matchObj.groups.as属性值就是undefined，并且as这个键名在groups是始终存在的。
//
// 解构赋值和替换
// 有了具名组匹配以后，可以使用解构赋值直接从匹配结果上为变量赋值。
//
// let {groups: {one, two}} = /^(?<one>.*):(?<two>.*)$/u.exec('foo:bar');
// one  // foo
// two  // bar
// 字符串替换时，使用$<组名>引用具名组。
//
// let re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/u;
//
// '2015-01-02'.replace(re, '$<day>/$<month>/$<year>')
// // '02/01/2015'
// 上面代码中，replace方法的第二个参数是一个字符串，而不是正则表达式。
//
// replace方法的第二个参数也可以是函数，该函数的参数序列如下。
//
// '2015-01-02'.replace(re, (
//     matched, // 整个匹配结果 2015-01-02
//     capture1, // 第一个组匹配 2015
//     capture2, // 第二个组匹配 01
//     capture3, // 第三个组匹配 02
//     position, // 匹配开始的位置 0
//     S, // 原字符串 2015-01-02
//     groups // 具名组构成的一个对象 {year, month, day}
// ) => {
//     let {day, month, year} = args[args.length - 1];
//     return `${day}/${month}/${year}`;
// });
// 具名组匹配在原来的基础上，新增了最后一个函数参数：具名组构成的一个对象。函数内部可以直接对这个对象进行解构赋值。
//
// 引用
// 如果要在正则表达式内部引用某个“具名组匹配”，可以使用\k<组名>的写法。
//
// const RE_TWICE = /^(?<word>[a-z]+)!\k<word>$/;
// RE_TWICE.test('abc!abc') // true
// RE_TWICE.test('abc!ab') // false
// 数字引用（\1）依然有效。
//
// const RE_TWICE = /^(?<word>[a-z]+)!\1$/;
// RE_TWICE.test('abc!abc') // true
// RE_TWICE.test('abc!ab') // false
// 这两种引用语法还可以同时使用。
//
// const RE_TWICE = /^(?<word>[a-z]+)!\k<word>!\1$/;
// RE_TWICE.test('abc!abc!abc') // true
// RE_TWICE.test('abc!abc!ab') // false
// String.prototype.matchAll
// 如果一个正则表达式在字符串里面有多个匹配，现在一般使用g修饰符或y修饰符，在循环里面逐一取出。
//
// var regex = /t(e)(st(\d?))/g;
// var string = 'test1test2test3';
//
// var matches = [];
// var match;
// while (match = regex.exec(string)) {
//     matches.push(match);
// }
//
// matches
// // [
// //   ["test1", "e", "st1", "1", index: 0, input: "test1test2test3"],
// //   ["test2", "e", "st2", "2", index: 5, input: "test1test2test3"],
// //   ["test3", "e", "st3", "3", index: 10, input: "test1test2test3"]
// // ]
// 上面代码中，while循环取出每一轮的正则匹配，一共三轮。
//
// 目前有一个提案，增加了String.prototype.matchAll方法，可以一次性取出所有匹配。不过，它返回的是一个遍历器（Iterator），而不是数组。
//
// const string = 'test1test2test3';
//
// // g 修饰符加不加都可以
// const regex = /t(e)(st(\d?))/g;
//
// for (const match of string.matchAll(regex)) {
//     console.log(match);
// }
// // ["test1", "e", "st1", "1", index: 0, input: "test1test2test3"]
// // ["test2", "e", "st2", "2", index: 5, input: "test1test2test3"]
// // ["test3", "e", "st3", "3", index: 10, input: "test1test2test3"]
// 上面代码中，由于string.matchAll(regex)返回的是遍历器，所以可以用for...of循环取出。相对于返回数组，返回遍历器的好处在于，如果匹配结果是一个很大的数组，那么遍历器比较节省资源。
//
// 遍历器转为数组是非常简单的，使用...运算符和Array.from方法就可以了。
//
// // 转为数组方法一
// [...string.matchAll(regex)]
//
// // 转为数组方法二
// Array.from(string.matchAll(regex));