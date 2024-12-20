import BinaryHeap from './_binaryheap.js';

class AStar {
    /**
     * 
     * @param {Array[Array[{x: Number, y: Number}]]} grid 
     * @param {Callable?} heuristic
     * @param {Callable?} gScore scoring function for adjacent grid nodes (if needed). By default new_g = prev_g + 1
     * @param {Callable?} onStep called on each successful step to enrich data (if needed)
     * @param {Callable?} isWall called to check if grid node is an impassable wall. By default checks if node.v === '#'
     */
    constructor(grid, heuristic, gScore, onStep, isWall) {
        this.heuristic = heuristic === undefined ? this.manhattan : heuristic;
        this.gScore = gScore === undefined ? (current, adjacent) => current.g + 1 : gScore;
        this.onStep = onStep === undefined ? () => {} : onStep;
        this.isWall = isWall === undefined ? (node => node.v === '#') : isWall;

        // Enrich frid nodes with some additional fields
        grid.forEach(row => row.forEach(node => {
            node.f = 0;
            node.g = 0;
            node.h = 0;
            node.visited = false;
            node.closed = false;
            node.parent = null;
        }));

        this.grid = grid;
    }

    printGrid() {
        return this.grid.map(row => row.map(node => this.printNode(node)).join('')).join('\n');
    }

    printNode(node) {
        return node.v;
    }

    heuristic(current, goal) {
        // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html

        let d1 = goal.x - current.x;
        if (d1 < 0) d1 = -d1; // eq. Math.abs();
        let d2 = goal.y - current.y;
        if (d2 < 0) d2 = -d2;
        return d1 + d2;
    } // manhattan

    // Get all adjacent nodes
    neighbors(node) {
        const grid = this.grid;
        let adjacent = [];
        const x = node.x;
        const y = node.y;

        if (grid[y - 1] && grid[y - 1][x]) adjacent.push(grid[y - 1][x]);
        if (grid[y + 1] && grid[y + 1][x]) adjacent.push(grid[y + 1][x]);
        if (grid[y]     && grid[y][x - 1]) adjacent.push(grid[y][x - 1]);
        if (grid[y]     && grid[y][x + 1]) adjacent.push(grid[y][x + 1]);

        return adjacent;
    } // neighbors

    search(start, end) {
        const grid = this.grid;

        const openHeap = new BinaryHeap(function (node) {
            return node.f;
        });
        openHeap.push(start);

        while (openHeap.size() > 0) {
            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            let currentNode = openHeap.pop();

            // End case -- result has been found, return the traced path
            if (currentNode === end) {
                let curr = currentNode;
                const ret = [];
                while (curr.parent) {
                    ret.push(curr);
                    curr = curr.parent;
                }
                return ret.reverse();
            }

            // Normal case -- move currentNode from open to closed, process each of its neighbors
            currentNode.closed = true;

            const neighbors = this.neighbors(currentNode);
            for (let i = 0, il = neighbors.length; i < il; i++) {
                const neighbor = neighbors[i];

                if (neighbor.closed || this.isWall(neighbor)) {
                    // not a valid node to process, skip to next neighbor
                    continue;
                }

                // gScore is the shortest distance from the current node to the adjacent one.
                // Accumulated g score is the shortest distance from the start to the current node.
                // We need to check if the path we have arrived at this neighbor is the shortest one we've seen so far.
                // Trivial case increments g score by one, weighted grapsh could use customized arithmetic.
                const gScore = this.gScore(currentNode, neighbor);
                const beenVisited = neighbor.visited;

                if (!beenVisited || gScore < neighbor.g) {
                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = neighbor.h === 0 ? 0 : this.heuristic(neighbor, end);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;

                    this.onStep(neighbor);
                    
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
    } // search
} // AStar

export default AStar;
