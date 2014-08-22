var genes, weights;

function GenePool(_genes, _weights) {
    genes = _genes;
    weights = _weights;
}

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

module.exports = GenePool;


