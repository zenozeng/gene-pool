var GenePool = require('./gene-pool');

// N: 个体基因数
// K: 种群规模（种群稳定时的数量）
// genes: 基因
// weights: 基因权重，影响出现的可能性大小
// mutationRate: 基因突变率，大约有多少比例的基因需要突变
// birthRate: 出生率

// timeout: 最大时限

function Population(opts) {

    // allow use object for gene
    var genes = opts.genes.map(function(gene, index) {
        return index;
    });
    this.oriGenes = opts.genes;
    this.fitness = function(individual) {
        individual = individual.map(function(geneIndex) {
            return opts.genes[geneIndex];
        });
        return opts.fitness(individual);
    };

    this.genePool = GenePool(genes, opts.N, opts.weights);
    this.K = opts.K;
    this.N = opts.N;
    // the very first generation
    this.population = [];
    this.history = {}; // 记住产生过的个体

    // 默认尝试1000次仍无新结果则取消尝试
    this.maxLoop = opts.maxLoop || 1000;

    this.birthRate = opts.birthRate;
    this.mutationRate = opts.mutationRate;
}

var population = Population.prototype;

// 繁殖
population.reproduction = function() {
    var child,
        gene;

    var maxLoop = this.maxLoop;

    // 初代基因总是由突变产生
    var mutationRate = this.population.length > 0 ? this.mutationRate : 2;

    while(this.population.length < this.K * (1 + this.birthRate)) {
        if(maxLoop < 0) {
            throw new Error('Fail to get new individual: exceeds the maxLoop, opts.maxLoop=' + this.maxLoop);
        }
        maxLoop--;
        child = [];
        while(child.length < this.N) {
            if(Math.random() < mutationRate) {
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
        // try to add child
        child.sort();
        var id = JSON.stringify(child);
        if(!this.history[id]) {
            this.history[id] = 1;
            this.population.push(child);
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
        return self.population[elem.index];
    });

    // kill weaker invididuals
    while(population.length > this.K) {
        population.pop();
    }

    this.population = population;
};

// 从当前种群中随机获取基因
population.getRandomGene = function() {
    var random = Math.random();
    // 随机选择，越靠前（fitness较高）的基因有较大概率得到遗传
    var individual = this.population[(random * random * this.population.length) | 0]; 
    return individual[(this.N * random) | 0];
};

// 下一代
population.next = function() {

    // 先繁殖
    this.reproduction();

    // 定向选择
    this.directionalSelection();

};

population.toArray = function() {
    var genes = this.oriGenes;
    return this.population.map(function(individual) {
        return individual.map(function(geneIndex) {
            return genes[geneIndex];
        });
    });
};

population.timeout = function(timeout, callback) {
    var self = this;
    var end = Date().now() + timeout;
    var iter = function() {
        if(Date().now() < end) {
            try {
                self.next();
                setTimeout(iter, 1);
            } catch(e) {
                callback(e, self.toArray());
            }
        } else {
            callback(null, self.toArray());
        }
    };
};

module.exports = Population;
