var utils = require('./utils'),
    GenePool = require('./gene-pool');

// N: 个体基因数
// K: 种群规模
// genes: 基因
// weights: 基因权重，影响出现的可能性大小
// mutationRate: 基因突变率，大约有多少比例的基因需要突变
// survivalRate: 存活率，换代时，每一代能够存活的比例

function Population(opts) {
    this.genePool = GenePool(opts.genes, opts.N, opts.weights);
    this.K = opts.K;
    this.isEqualIndividual = opts.isEqualIndividual;
    this.fitness = opts.fitness;
    // the very first generation
    this.population = [];
    this.ids = []; // 记住产生过的个体
    // 将个体数补满到 K
    while(this.population.length < this.K) {
        var individual = this.genePool.getRandomIndividual();
        this.tryAddIndividual(individual);
    }
    this.survivalRate = opts.survivalRate;
}

var population = Population.prototype;

// 尝试增加个体，若历史上存在过则不会再次产生
population.tryAddIndividual = function(individual) {
    var id = JSON.stringify(individual.sort());
    if(this.ids.indexOf(id) < 0) {
        this.ids.push(id);
        this.population.push(individual);
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
    while(population.length > this.K * this.survivalRate) {
        population.pop();
    }

    this.population = population;
};

// 从当前种群中随机获取基因
population.getRandomGene = function() {
    var random = Math.random();
    // 随机选择，越靠前（fitness较高）的基因有较大概率得到遗传
    var individual = this.population[parseInt(random * random * this.population.length)]; 
    return individual[parseInt(this.N * random)];
};

// 下一代
population.next = function() {

    // 定向选择
    this.directionalSelection();

    // 交叉互换基因产生子代
    // 补充总个体数到 K 值
    var child,
        gene;
    while(this.population.length < this.K) {
        child = [];
        while(child.length < this.N) {
            if(Math.random() < this.mutationRate) {
                // 基因突变
                gene = this.genePool.getRandomGene();
            } else {
                // 从当前种群里获取基因
                gene = this.getRandomGene();
            }
            if(child.indexOf(gene) < 0) {
                child.push(gene);
            }
        }
        this.tryAddIndividual(child);
    }
};
