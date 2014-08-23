(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// genes: 基因库
// n: 单个个体基因数
// weights: 每个基因的权重，影响出现的随机程度

var utils = require('./utils');

function GenePool(genes, n, weights) {

    if(n > genes.length) {
        throw new Error("n must <= genes.length");
    }

    weights = weights || genes.map(function() { return 1; });

    // todo: test this
    // 随机取得一条基因
    var getRandomGene = (function(genes, weights) {
        var sum = 0;
        var weightBounds = weights.map(function(weight) {
            sum += weight;
            return sum;
        });
        return (function() {
            var random = Math.random() * sum;
            for(var i = 0; i < weightBounds.length; i++) {
                if(random < weightBounds[i]) {
                    return genes[i];
                }
                return genes[weightBounds.length];
            }
        });
    })(genes, weights);

    // 获取一个随机个体（数组），该个体内含 n 条不重复的基因
    var getRandomIndividual = function() {
        var genes = [],
            gene = null;
        while(genes.length < n) {
            gene = getRandomGene();
            if(genes.indexOf(gene) < 0) {
                genes.push(gene);
            }
        }
        return genes;
    };

    return {
        getRandomGene: getRandomGene,
        getRandomIndividual: getRandomIndividual
    };
}

module.exports = GenePool;



},{"./utils":3}],2:[function(require,module,exports){
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

},{"./gene-pool":1,"./utils":3}],3:[function(require,module,exports){
var utils = {};

utils.inArray = function(elem, array, isEqual) {
    isEqual = isEqual || (function(a, b) { return a == b; });
    for(var i = 0; i < array.length; i++) {
        if(isEqual(array[i], elem)) {
            return true;
        }
    }
    return false;
};

module.exports = utils;

},{}]},{},[2]);