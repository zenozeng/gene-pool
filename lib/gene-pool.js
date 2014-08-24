// genes: 基因库
// n: 单个个体基因数
// weights: 每个基因的权重，影响出现的随机程度

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


