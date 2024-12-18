// Day 18

import fs from 'node:fs/promises';
const INPUT = await fs.readFile('./input/18.txt', { encoding: 'utf8' });

const DATA = INPUT.split('\n').map(r => r.split(',').map(Number));

// const END_X = 6;
// const END_Y = 6;

const END_X = 70;
const END_Y = 70;

const fillMap = (listCorrupted) => {
    const map = Array(END_Y + 1).fill(null, 0, END_Y + 1).map(v => Array(END_X + 1).fill('.', 0, END_X + 1));
    listCorrupted.forEach(p => map[p.y][p.x] = p.v);
    return map;
};

const convertMap = map => map.map((row, x) => row.map((v, y) => ({
    x,
    y,
    v
})));

const printMap = map => map.map(row => row.join('')).join('\n');

// console.log(DATA);



//  https://eloquentjavascript.net/1st_edition/appendix2.html
function BinaryHeap(scoreFunction) {
    this.content = [];
    this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
    push: function (element) {
        // Add the new element to the end of the array.
        this.content.push(element);
        // Allow it to sink down.
        this.sinkDown(this.content.length - 1);
    }, // push

    pop: function () {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it bubble up.
        if (this.content.length > 0) {
            this.content[0] = end;
            this.bubbleUp(0);
        }
        return result;
    }, // pop

    remove: function (node) {
        var i = this.content.indexOf(node);

        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        var end = this.content.pop();
        if (i != this.content.length - 1) {
            this.content[i] = end;
            if (this.scoreFunction(end) < this.scoreFunction(node)) this.sinkDown(i);
            else this.bubbleUp(i);
        }
    }, // remove

    size: function () {
        return this.content.length;
    },

    rescoreElement: function (node) {
        this.sinkDown(this.content.indexOf(node));
    }, // rescoreElement

    sinkDown: function (n) {
        // Fetch the element that has to be sunk.
        var element = this.content[n];
        // When at 0, an element can not sink any further.
        while (n > 0) {
            // Compute the parent element's index, and fetch it.
            var parentN = ((n + 1) >> 1) - 1,
                parent = this.content[parentN];
            // Swap the elements if the parent is greater.
            if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                this.content[parentN] = element;
                this.content[n] = parent;
                // Update 'n' to continue at the new position.
                n = parentN;
            }
            // Found a parent that is less, no need to sink any further.
            else {
                break;
            }
        }
    }, // sinkDown

    bubbleUp: function (n) {
        // Look up the target element and its score.
        var length = this.content.length,
            element = this.content[n],
            elemScore = this.scoreFunction(element);

        while (true) {
            // Compute the indices of the child elements.
            var child2N = (n + 1) << 1,
                child1N = child2N - 1;
            // This is used to store the new position of the element,
            // if any.
            var swap = null;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up and compute its score.
                var child1 = this.content[child1N],
                    child1Score = this.scoreFunction(child1);
                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore) swap = child1N;
            }
            // Do the same checks for the other child.
            if (child2N < length) {
                var child2 = this.content[child2N],
                    child2Score = this.scoreFunction(child2);
                if (child2Score < (swap == null ? elemScore : child1Score))
                    swap = child2N;
            }

            // If the element needs to be moved, swap it, and continue.
            if (swap != null) {
                this.content[n] = this.content[swap];
                this.content[swap] = element;
                n = swap;
            }
            // Otherwise, we are done.
            else {
                break;
            }
        }
    }, // bubbleUp
};

var astar = {
    init: function (grid) {
        grid.forEach(row => row.forEach(node => {
            node.f = 0;
            node.g = 0;
            node.h = 0;
            node.visited = false;
            node.closed = false;
            node.parent = null;
        }));
    }, // init

    search: function (grid, start, end, heuristic) {
        astar.init(grid);
        var heuristic = heuristic || astar.manhattan;

        var openHeap = new BinaryHeap(function (node) {
            return node.f;
        });
        openHeap.push(start);

        while (openHeap.size() > 0) {
            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            var currentNode = openHeap.pop();

            // End case -- result has been found, return the traced path
            if (currentNode === end) {
                var curr = currentNode;
                var ret = [];
                while (curr.parent) {
                    ret.push(curr);
                    curr = curr.parent;
                }
                return ret.reverse();
            }

            // Normal case -- move currentNode from open to closed, process each of its neighbors
            currentNode.closed = true;

            var neighbors = astar.neighbors(grid, currentNode);
            for (var i = 0, il = neighbors.length; i < il; i++) {
                var neighbor = neighbors[i];

                if (neighbor.closed || neighbor.v === '#') {
                    // not a valid node to process, skip to next neighbor
                    continue;
                }

                // g score is the shortest distance from start to current node, we need to check if
                //   the path we have arrived at this neighbor is the shortest one we have seen yet
                // 1 is the distance from a node to it's neighbor. This could be variable for weighted paths.
                var gScore = currentNode.g + 1;
                var beenVisited = neighbor.visited;

                if (!beenVisited || gScore < neighbor.g) {
                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = neighbor.h || heuristic(neighbor, end);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;

                    if (!beenVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.push(neighbor);
                    } else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        openHeap.rescoreElement(neighbor);
                    }
                }
            } // for
        } // while

        // No result was found -- empty array signifies failure to find path
        return [];
    }, // search

    manhattan: function (pos0, pos1) {
        // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html

        var d1 = pos1.x - pos0.x;
        if (d1 < 0) d1 = -d1; // eq. Math.abs();
        var d2 = pos1.y - pos0.y;
        if (d2 < 0) d2 = -d2;
        return d1 + d2;
    }, // manhattan

    neighbors: function (grid, node) {
        var ret = [];
        var x = node.x;
        var y = node.y;

        if (grid[x - 1] && grid[x - 1][y]) {
            ret.push(grid[x - 1][y]);
        }
        if (grid[x + 1] && grid[x + 1][y]) {
            ret.push(grid[x + 1][y]);
        }
        if (grid[x] && grid[x][y - 1]) {
            ret.push(grid[x][y - 1]);
        }
        if (grid[x] && grid[x][y + 1]) {
            ret.push(grid[x][y + 1]);
        }
        return ret;
    }, // neighbors
};






// const CORRUPTED_LEN = 12;
const CORRUPTED_LEN = 1024;

let listCorrupted = DATA.slice(0, CORRUPTED_LEN).map(xy => {const [x, y] = xy; return {x, y, v: '#'};});
// console.log(listCorrupted);

let map = fillMap(listCorrupted);
console.log(printMap(map) + '\n');

let mapNodes = convertMap(map);
const start = mapNodes[0][0];
const end = mapNodes[END_Y][END_X];

const shortest_path = astar.search(mapNodes, start, end);
// console.log(shortest_path);

shortest_path.forEach(node => {
    map[node.y][node.x] = 'O';
});
console.log(printMap(map) + '\n');

console.log(shortest_path.length);


// Part 2

for (let i = CORRUPTED_LEN + 1; i < DATA.length; i++) {
    let listCorrupted = DATA.slice(0, i).map(xy => {const [x, y] = xy; return {x, y, v: '#'};});
    let map = fillMap(listCorrupted);

    let mapNodes = convertMap(map);
    const start = mapNodes[0][0];
    const end = mapNodes[END_Y][END_X];

    const shortest_path = astar.search(mapNodes, start, end);
    if (shortest_path.length === 0) {
        // console.log(printMap(map) + '\n'); // debug
        console.log(listCorrupted.at(-1));

        break;
    }

}