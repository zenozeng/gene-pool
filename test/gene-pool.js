var GenePool = require('../lib/gene-pool.js');

var pool = GenePool([1, 2, 3, 4], 3, [1, 2, 3, 4]);

var genes = {};

var population = {};

for(var i = 0; i < 100 * 1000; i++) {
    var gene = pool.getRandomGene();
    genes[gene] = typeof genes[gene] == "undefined" ? 0 : (genes[gene] + 1);

    var individual = JSON.stringify(pool.getRandomIndividual().sort());
    population[individual] = typeof population[individual] == "undefined" ? 1 : (population[individual] + 1);
}

console.log(genes);

console.log(population);
