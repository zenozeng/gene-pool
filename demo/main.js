
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
    opts.fitness = function(rgb) {
        console.log('fitness', rgb);
        return rgb[0];
    };
    console.log('hello');
    var population = new GenePool(opts);
    window.population = population;
    population.next();
});
