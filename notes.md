1.js 中怎样拼接字符窜速度最快
    知乎回答的方案有:
    a: +
    b: join
    c: concat
    d: 缓存array.length
    结论: 老版本的ie对字符串数组用join快
          现代浏览器直接用+
2.console.time('testName');
  test();
  console.timeEnd('testName');
  上面代码可以用于测试代码执行时间