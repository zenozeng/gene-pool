var Population = require('../lib/population.js');
var fitness = function(x) {
    return x[0] + x[1];
};
var population = new Population([1, 2, 3, 4, 5, 6, 7, 8], 2, fitness);
