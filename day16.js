// Day 16

import AStar from './_astar.js';

import fs from 'node:fs/promises';
import process from 'node:process';

const INPUT = await fs.readFile('./input/16.txt', { encoding: 'utf8' });

// 16_alt.txt wrong answer (105512). correct is 105508
// https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm 
// fix: save both cost and direction to "visited" prop

const DATA = INPUT.split('\n').map(r => r.split(''));

const WIDTH = DATA.length;
const HEIGHT = DATA[0]?.length;

const getFirstPos = (map, value) => {
    let x = -1;
    let y = map.findIndex(row => {
        x = row.findIndex(v => v === value);
        return x !== -1;
    });
    return [x, y];
}


// console.log(getFirstPos(DATA, 'S'));
// console.log(getFirstPos(DATA, 'E'));

const convertMap = map => map.map((row, y) => row.map((v, x) => ({
    x,
    y,
    v,
    direction: '',
})));


// console.log( MAP.map(r => r.join('')).join('\n') + '\n' ); // debug


let mapConverted = convertMap(DATA);

const [startX, startY] = getFirstPos(DATA, 'S');
const [endX, endY] = getFirstPos(DATA, 'E');

const start = mapConverted[startX][startY];
//  Start is facing east
start.direction = '>';
const end = mapConverted[endX][endY];

const heuristic = (current, goal) => {
    const dx = current.x - goal.x;
    const dy = current.y - goal.y;

    let mDist = Math.max(Math.abs(dx), Math.abs(dy));
    if (current.direction !== goal.direction) mDist += 1000;

    return mDist;
}

const gScore = (currentNode, neighbor) => {
    let rotation = 0;
    if (currentNode.x < neighbor.x && currentNode.direction !== '>') rotation = 1000;
    if (currentNode.x > neighbor.x && currentNode.direction !== '<') rotation = 1000;
    if (currentNode.y < neighbor.y && currentNode.direction !== 'v') rotation = 1000;
    if (currentNode.y > neighbor.y && currentNode.direction !== '^') rotation = 1000;

    return currentNode.g + rotation;
}

const onStep = (currentNode, neighbor) => {
    if (currentNode.x < neighbor.x) neighbor.direction = '>';
    if (currentNode.x > neighbor.x) neighbor.direction = '<';
    if (currentNode.y < neighbor.y) neighbor.direction = 'v';
    if (currentNode.y > neighbor.y) neighbor.direction = '^';
}

const astar = new AStar(mapConverted, heuristic, gScore, onStep);
const shortest_path = astar.search(start, end);

// console.log(`Start: ${startX}, ${startY}`);;
// console.log(`End: ${endX}, ${endY}`);

const DATA2 = structuredClone(DATA);
console.log(DATA.map(r => r.join('')).join('\n') + '\n'); // debug

let score = 0;
let lastDir = start.direction;
shortest_path.forEach(node => {
    score++;
    if (lastDir !== node.direction) {
        score += 1000;
        lastDir = node.direction;
    }
    if (node.v !== 'E') DATA[node.x][node.y] = node.direction;
});

console.log(DATA.map(r => r.join('')).join('\n') + '\n'); // debug

// console.log(shortest_path.at(-1));
// console.log(shortest_path.length); // steps count
console.log(shortest_path.at(-1).g + shortest_path.length);
console.log(`Part_1: ${score}`);

// WTF. Now it is 136536 instead of 135536 !

process.exit();

// Part 2
let grid = convertMap(DATA2);

let test_score = 0;
lastDir = start.direction;
shortest_path.forEach(pathNode => {
    test_score++;
    if (lastDir !== pathNode.direction) {
        test_score += 1000;
        lastDir = pathNode.direction;
    }
    DATA2[pathNode.x][pathNode.y] = 'O'; 

    const test_grid = structuredClone(grid);
    const test_nodes = astar.neighbors(test_grid, pathNode).filter(n => n.v === '.');

    test_nodes.forEach(test_node => {
        let tmp_score = test_score;
        let last_probable_dir = lastDir;
        
        const test_grid = structuredClone(grid);
        const probable_path = astar.search(test_grid, test_node, test_grid[endX][endY], heuristic);
        // console.log(probable_path.length);

        probable_path.forEach(pnode => {
            tmp_score++;
            if (last_probable_dir !== pnode.direction) {
                tmp_score += 1000;
                last_probable_dir = pnode.direction;
            }
        });

        if (tmp_score <= score) {
            probable_path.forEach(pnode => {
                DATA2[pnode.x][pnode.y] = 'O'; 
            });
        }


    });


});

console.log(DATA2.map(r => r.join('')).join('\n') + '\n'); // debug

console.log( DATA2.map(r => r.join('')).join('\n').match(/O/g)?.length );

// 538 — answer is too low
// Curiously, it's the right answer for someone else
