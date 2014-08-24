// 测试完全穷举的性能

var Combinatorics = require('js-combinatorics').Combinatorics;
var n = 30;
var arr = [];
for(var i = 0; i < n; i++) {
    arr.push(i.toString());
}
var cmb = Combinatorics.combination(arr, 5);
var start = Date.now();
var slow_fitness = function(item) {
    return Math.sqrt(parseInt(item) * parseInt(item) * parseInt(item));
};
var results = cmb.toArray();
console.log(results.length);
var end = Date.now();
console.log([start, end, end - start]);
results.sort(function(a, b) {
    return slow_fitness(a) - slow_fitness(b);
});
console.log([end, Date.now(), Date.now() - end]);
// console.log(results);
