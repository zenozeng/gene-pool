var drawColors = function(colors) {
    var div = colors.map(function(color) {
        return "<div class='color' style='background: rgb(" + color.join(',') + ")'></div>";
    });
    $('#colors').html(div.join(''));
};

var fitness = function(individual) {
    var fitness = 0;
    for(var i = 0; i < individual.length; i++) {
        var rgb = individual[i];
        fitness += rgb[0] + rgb[1] + rgb[2];
    }
    return fitness;
};

var drawColorSchemes = function(colorSchemes, timeout) {
    var indexA = colorSchemes.map(function(scheme) {
        return scheme.join();
    });
    $("[data-scheme]").each(function() {
        if(indexA.indexOf($(this).attr('data-scheme')) < 0) {
            $(this).fadeOut(2000, function() {
                $(this).remove();
            });
        }
    });
    // add new schemes
    setTimeout(function() {
        var html = colorSchemes.map(function(scheme) {
            var elem = $("[data-scheme='" + scheme.join() + "']");
            if(elem[0]) return;
            var html = scheme.map(function(color) {
                var className = 'color';
                if(!$("[data-color='" + color.join() + "']")[0]) {
                    // 不是从种群中来的颜色，那就是突变来的
                    className += ' mutation';
                }
                return "<div class='" + className + "' data-color='" + color.join() + "'style='background: rgb(" + color.join(',') + ")'></div>";
            });
            scheme = "<div class='scheme' data-scheme='" + scheme.join() + "'>"
                + "<div class='fitness'>Fitness: " + fitness(scheme) + "</div>"
                + html.join('') 
                + "</div>";
            return scheme;
        });
        $('#schemes').append(html.join(''));
    }, timeout);
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
    opts.K = 5;
    opts.N = 39;
    opts.mutationRate = 0.1;
    opts.survivalRate = 0.5;
    opts.fitness = fitness;
    var population = new GenePool(opts);
    drawColorSchemes(population.toArray(), 0);
    $('#iter').click(function() {
        population.next();
        drawColorSchemes(population.toArray(), 2000);
    });
});
