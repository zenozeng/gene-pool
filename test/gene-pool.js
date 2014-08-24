var GenePool = require('../lib/gene-pool.js');

var pool = GenePool([1, 2, 3, 4], 3, [1, 2, 3, 4]);

var genes = {};

var population = {};

console.log('TEST * 10^6');

console.time('random gene');
for(var i = 0; i < 1000 * 1000; i++) {
    var gene = pool.getRandomGene();
    genes[gene] = typeof genes[gene] == "undefined" ? 0 : (genes[gene] + 1);
}
console.timeEnd('random gene');

console.time('random individual');
for(var i = 0; i < 1000 * 1000; i++) {
    var individual = JSON.stringify(pool.getRandomIndividual().sort());
    population[individual] = typeof population[individual] == "undefined" ? 1 : (population[individual] + 1);
}
console.timeEnd('random individual');

console.log(genes);

console.log(population);
