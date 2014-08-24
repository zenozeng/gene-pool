#!/bin/bash
# sudo apt-get install inotify-tools

while true; do
    inotifywait -r -e create,delete,modify,move .
    ./build.sh
done
