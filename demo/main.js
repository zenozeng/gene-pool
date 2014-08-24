
$.get('pool.json', function(data) {
    var opts = {};
    opts.genes = data.map(function(data) {
        return data.rgb;
    });
    opts.weights = data.map(function(data) {
        return data.weight;
    });
    opts.K = 20;
    opts.N = 5;
    opts.mutationRate = 0.5;
    opts.survivalRate = 0.5;
    opts.fitness = function(individual) {
        var fitness = 0;
        for(var i = 0; i < individual.length; i++) {
            fitness += individual[i][0];
        }
        return fitness;
    };
    var population = new GenePool(opts);
    console.log(population.toArray());
    window.population = population;
    population.next();
});
