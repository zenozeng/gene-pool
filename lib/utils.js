var utils = {};

utils.inArray = function(elem, array, isEqual) {
    isEqual = isEqual || (function(a, b) { return a == b; });
    for(var i = 0; i < array.length; i++) {
        if(isEqual(array[i], elem)) {
            return true;
        }
    }
    return false;
};

module.exports = utils;
