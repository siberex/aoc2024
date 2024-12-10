// Day 10

import fs from 'node:fs/promises';

const INPUT = await fs.readFile('./input/10.txt', { encoding: 'utf8' });

const DATA = INPUT.split('\n').map(r => r.split('').map(Number));
const WIDTH = DATA.length;
const HEIGHT = DATA[0]?.length;

const isOutOfBounds = (x, y) => x < 0 || y < 0 || x > WIDTH - 1 || y > HEIGHT - 1;

function getDirections(x, y) {
    const result = [];
    if ( isOutOfBounds(x, y) ) return result;
    const v = DATA[x][y];
    if ( !isOutOfBounds(x - 1, y) && DATA[x - 1][y] === v + 1 ) result.push([x - 1, y]);
    if ( !isOutOfBounds(x + 1, y) && DATA[x + 1][y] === v + 1 ) result.push([x + 1, y]);
    if ( !isOutOfBounds(x, y - 1) && DATA[x][y - 1] === v + 1 ) result.push([x, y - 1]);
    if ( !isOutOfBounds(x, y + 1) && DATA[x][y + 1] === v + 1 ) result.push([x, y + 1]);
    return result;
}


let trailheads = [];

DATA.forEach((r, i) => r.forEach((h, j) => {
    if (h === 0) trailheads.push([i, j]); 
}));
console.log(`trailheads: ${trailheads.length}`);


function walkTrail(map, trailhead, score) {
    if (score === undefined) score = 0;

    let [x, y] = trailhead;
    // end of the trail, mark map and return
    if (map[x][y] === 9) {map[x][y] = -1; return 1 };

    let forks = getDirections(x, y);
    if (forks.length === 0) return 0; // dead end

    // only one way forward
    if (forks.length === 1) return walkTrail(map, forks[0]);

    // multiple ways forward
    let scores = forks.map(
        dir => walkTrail(map, dir, score)
    ).reduce((acc, v) => (acc + v), 0);
    
    return scores;
}

const scores = trailheads.map(trailhead => walkTrail(structuredClone(DATA), trailhead));
console.log(scores.reduce((acc, v) => (acc + v), 0));


function walkTrailRate(trailhead, score) {
    if (score === undefined) score = 0;

    let [x, y] = trailhead;
    if (DATA[x][y] === 9) return 1; // end of the trail

    let forks = getDirections(x, y);
    if (forks.length === 0) return 0; // dead end

    // only one way forward
    if (forks.length === 1) return walkTrailRate(forks[0], score);

    // multiple ways forward
    let scores = forks.map(
        dir => walkTrailRate(dir, score)
    ).reduce((acc, v) => (acc + v), 0);
    
    return scores;
}

const ratings = trailheads.map(trailhead => walkTrailRate(trailhead));
console.log(ratings.reduce((acc, v) => (acc + v), 0));
