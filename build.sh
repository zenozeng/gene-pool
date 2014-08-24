#!/bin/bash
echo "Build"
browserify lib/population.js -s GenePool > browser.js
