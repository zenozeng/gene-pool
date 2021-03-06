!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.GenePool=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// genes: 基因库
// n: 单个个体基因数
// weights: 每个基因的权重，影响出现的随机程度

function GenePool(genes, n, weights) {

    if(n > genes.length) {
        throw new Error("n must <= genes.length");
    }

    weights = weights || genes.map(function() { return 1; });

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
            }
            return genes[weightBounds.length - 1];
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
            } else {
                genes = []; // 保证概率分布结果符合预期，见：https://github.com/zenozeng/gene-pool/issues/2
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



},{}],2:[function(require,module,exports){
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
population.reproduce = function() {
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
population.select = function() {
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
    this.reproduce();

    // 定向选择
    this.select();

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

},{"./gene-pool":1}]},{},[2])(2)
});