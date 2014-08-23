// genes: 基因库
// n: 单个个体基因数
// weights: 每个基因的权重，影响出现的随机程度
// isEqual: 用于比较两个基因是否相等的函数，默认情况下用 ==

var utils = require('./utils');

function GenePool(genes, n, weights, isEqual) {

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
            if(!utils.inArray(gene, genes, isEqual)) {
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


