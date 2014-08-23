var utils = require('./utils'),
    GenePool = require('./gene-pool');

// N: 个体基因数
// K: 种群规模
function Population(opts) {
    this.genePool = GenePool(opts.genes, opts.N, opts.weights, opts.isEqualGene);
    this.K = opts.K;
    this.isEqualIndividual = opts.isEqualIndividual;
    this.fitness = opts.fitness;
}

var population = Population.prototype;

population.init = function() {
    // the very first generation
    this.population = [];
    this.generate();
};


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
    // sort by fitness
    
    // kill weaker invididuals
    while(this.population.length > this.K) {
        this.population.pop();
    }
};

population.newIndividual = function() {
    var individual = this.genePool.getRandomIndividual();
    this.population.push();
    // 注意插入时按 invidial fitness 排序
};

population.nextGeneration = function() {
    // 随便找一个基因位点突变
    var mutation = function(individual) {
        
    };

    var crossover = function(a, b) {
    };
};
