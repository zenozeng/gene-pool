var utils = require('./utils'),
    GenePool = require('./gene-pool');

// N: 个体基因数
// K: 种群规模
// isEqualGene: 判断两个基因是否相同
// isEqualIndividual: 判断两个个体是否相同

function Population(opts) {
    this.genePool = GenePool(opts.genes, opts.N, opts.weights, opts.isEqualGene);
    this.K = opts.K;
    this.isEqualIndividual = opts.isEqualIndividual;
    this.fitness = opts.fitness;
    // the very first generation
    this.population = [];
    this.generate();
}

var population = Population.prototype;

// 将个体数补满到 K
population.generate = function() {
    while(this.population.length < this.K) {
        var individual = this.genePool.getRandomIndividual();
        if(!utils.inArray(individual, this.population, this.isEqualIndividual)) {
            this.population.push(individual);
        }
    }
};

// 人工定向选择
population.directionalSelection = function() {
    var self = this;

    // Sort by fitness

    var fitness = this.population.map(function(individual, i) {
        return {index: i, fitness: self.fitness(individual)};
    }).sort(function(a, b) {
        return b.fitness - a.fitness;
    });

    var population = fitness.map(function(elem) {
        return this.population[elem.index];
    });

    // kill weaker invididuals
    while(population.length > this.K) {
        population.pop();
    }

    this.population = population;
};

population.nextGeneration = function() {
    // 随便找一个基因位点突变
    var mutation = function(individual) {
        
    };

    var crossover = function(a, b) {
    };
};
