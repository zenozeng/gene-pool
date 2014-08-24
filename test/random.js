console.time('random 10^8');
for(var i = 0; i < 10000 * 10000; i++) {
    Math.random();
}
console.timeEnd('random 10^8');

console.time('parseInt(Math.random() * 99) 10^8');
for(var i = 0; i < 10000 * 10000; i++) {
    parseInt(Math.random() * 99);
}
console.timeEnd('parseInt(Math.random() * 99) 10^8');

console.time('Math.random() * 99 | 0; 10^8');
for(var i = 0; i < 10000 * 10000; i++) {
    Math.random() * 99 | 0;
}
console.timeEnd('Math.random() * 99 | 0; 10^8');
