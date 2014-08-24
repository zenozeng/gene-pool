var drawColors = function(colors) {
    var div = colors.map(function(color) {
        return "<div class='color' style='background: rgb(" + color.join(',') + ")'></div>";
    });
    $('#colors').html(div.join(''));
};

var drawColorSchemes = function(colorSchemes) {
    // add new schemes
    colorSchemes.forEach(function(scheme) {
        var elem = $("[data-scheme='" + scheme.join() + "']");
        if(elem[0]) return;
        scheme = scheme.map(function(color) {
            return "<div class='color' style='background: rgb(" + color.join(',') + ")'></div>";
        });
        $('#schemes').append("<div class='scheme'>" + scheme.join('') + "</div>");
    });
};

$.get('pool.json', function(data) {
    var opts = {};
    opts.genes = data.map(function(data) {
        return data.rgb;
    });
    drawColors(opts.genes);
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
    drawColorSchemes(population.toArray());
    window.population = population;
    population.next();
});
