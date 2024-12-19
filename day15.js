// Day 15

import fs from 'node:fs/promises';

const INPUT = await fs.readFile('./input/15.test3', { encoding: 'utf8' });

const [strMap, strMoves] = INPUT.split('\n\n')
const MAP = strMap.split('\n').map(row => row.split(''));
let MOVES = [];
strMoves.split('\n').forEach(line => MOVES = MOVES.concat(line.split('')));

const WIDTH = MAP.length;
const HEIGHT = MAP[0]?.length;

const movesMapDirections = {
    '>': [ 0,  1],
    'v': [ 1,  0],
    '<': [ 0, -1],
    '^': [-1,  0]
}

const getPos = map => {
    let x = -1, y = -1;
    map.forEach((row, i) => {
        row.forEach((v, j) => {
            if (v === '@') {
                x = i;
                y = j;
            }
        });
    });
    return [x, y];
}
const getTotalGps = map => {
    let total = 0;
    map.forEach((row, i) => {
        row.forEach((v, j) => {
            if (v === 'O') {
                total += (i * 100 + j);
            }
        });
    });
    return total;
}

// console.log(WIDTH, HEIGHT);

let [X, Y] = getPos(MAP);
console.log([X, Y]);
console.log( MAP.map(r => r.join('')).join('\n') + '\n' ); // debug
// console.log(MOVES);


const getMovableCrates = (map, x, y) => {



}


const move = (map, pos, dir, debug) => {
    let [x, y] = pos;
    let [dx, dy] = movesMapDirections[dir];

    const obj = map[x + dx][y + dy];

    // if (debug) console.log(obj, [x, y], [dx, dy]);

    // Wall, don't move
    if (obj === '#') return [x, y];
    
    // Empty cell, move freely
    if (obj === '.' || obj === '@') return [x + dx, y + dy];
    
    if (obj === 'O') {
        // Crate, check possible movement

        let cx = x + dx, cy = y + dy;

        while (map[cx][cy] === 'O') {
            cx += dx;
            cy += dy;
        }

        if (debug) console.log([cx, cy], map[cx][cy]);

        // wall after line of crates, don't move
        if (map[cx][cy] === '#') {
            return [x, y];
        }

        if (map[cx][cy] === '.') {
            // Modify map by pushing containers

            if (dx > 0) {
                for (let i = x + dx; i <= cx; i++) {
                    map[i][y] = 'O';
                }
            }
            if (dx < 0) {
                for (let i = cx; i <= x + dx; i++) {
                    map[i][y] = 'O';
                }
            }
            if (dy > 0) {
                for (let j = y + dy; j <= cy; j++) {
                    map[x][j] = 'O';
                }

                // if (debug) console.log( y + dy, cy, dy, map[cx][cy] );
            }
            if (dy < 0) {
                for (let j = cy; j <= y + dy; j++) {
                    map[x][j] = 'O';
                }

                // if (debug) console.log( y + dy, cy, dy, map[cx][cy] );
            }

            map[x + dx][y + dy] = '.';
            return [x + dx, y + dy];
        }
    }
    
    // This should not happen
    return undefined;
}




let pos = [X, Y];
MAP[X][Y] = '.';
MOVES.forEach(dir => {
    pos = move(MAP, pos, dir);
});
MAP[ pos[0] ][ pos[1] ] = '@';
// console.log( MAP.map(r => r.join('')).join('\n') + '\n' ); // debug

console.log(getTotalGps(MAP));



// Part 2

const wideStringsMap = {
    '#': '##',
    'O': '[]',
    '.': '..',
    '@': '@.',
}
const WIDEMAP = strMap.split('\n').map(row => row.split('').flatMap(k => wideStringsMap[k].split('')));

[X, Y] = getPos(WIDEMAP);
console.log([X, Y]);
console.log( WIDEMAP.map(r => r.join('')).join('\n') + '\n' ); // debug

const moveWide = (map, pos, dir, debug) => {
    let [x, y] = pos;
    let [dx, dy] = movesMapDirections[dir];

    const obj = map[x + dx][y + dy];

    if (debug) console.log(obj, [x, y], [dx, dy]);

    // Wall, don't move
    if (obj === '#') return [x, y];

    // Empty cell, move freely
    if (obj === '.' || obj === '@') return [x + dx, y + dy];

    // Wide crate
    if (obj === '[' || obj === ']') {
        let cx = x + dx, cy = y + dy;
    
        let crateLine = '';
        while (map[cx][cy] === '[' || map[cx][cy] === ']') {
            crateLine += map[cx][cy];
            cx += dx;
            cy += dy;
        }

        // Wall after the line of crates, don't move
        if (map[cx][cy] === '#') {
            return [x, y];
        }

        // Moving left or right
        if (dx !== 0) {
            // Change map
            if (dx > 0) {
                for (let i = x + dx; i <= cx; i++) {
                    map[i][y] = crateLine.shift();
                }
            }
            if (dx < 0) {
                for (let i = x + dx; i >= cx; i--) {
                    map[i][y] = crateLine.shift();
                }
            }
        }
        
        // Moving up or down, have to check the whole crate stack for obstacles
        if (dy !== 0) {
            if (dy > 0) {
                let depth = 1;
                const crateHalf1 = crateLine.shift();
                let crateHalf2;

                if (crateHalf1 === '[') {
                    crateHalf2 = map[x + 1][y + depth * dy];
                    // 

                } else if (crateHalf1 === ']') {
                    crateHalf2 = map[x - 1][y + depth * dy];
                    // 

                }





            }



            // Change map

        }

        map[x + dx][y + dy] = '.';
        return [x + dx, y + dy];
    }

    // This should not happen
    return undefined;
}


