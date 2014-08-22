// genes: 基因库
// n: 单个个体基因数
// weights: 每个基因的权重，影响出现的随机程度
function GenePool(genes, n, weights) {

    // todo: test this
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

    return {
        getRandomGene: getRandomGene
    };
}

module.exports = GenePool;


