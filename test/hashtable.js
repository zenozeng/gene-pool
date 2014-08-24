var obj = {}, i;

console.time('join 10^5');
for(i = 0; i < 100 * 10000; i++) {
    obj[[1, 2, 3, 4, 5].join()] = 1;
}
console.timeEnd('join 10^5');

console.time('JSON.stringify 10^5');
for(i = 0; i < 100* 10000; i++) {
    obj[JSON.stringify([1, 2, 3, 4, 5])] = 1;
}
console.timeEnd('JSON.stringify 10^5');

console.time('toString() 10^5');
for(i = 0; i < 100* 10000; i++) {
    obj[[1, 2, 3, 4, 5].toString()] = 1;
}
console.timeEnd('toString() 10^5');

console.time('genID 10^5');
var genID = function(arr) {
    var id = 0;
    arr.forEach(function(elem) {
        id += 1 << elem;
    });
    return id;
};
for(i = 0; i < 100* 10000; i++) {
    obj[genID([1, 2, 3, 4, 5])] = 1;
}
console.timeEnd('genID 10^5');
