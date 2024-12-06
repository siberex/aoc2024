// AoC2024. Day 6. Deoptimized ersion

let INPUT = await fetch('https://adventofcode.com/2024/day/6/input')
    .then(response => response.text())
    .catch(err => console.error(err));

/*
INPUT = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;
*/

const INITIAL_MAP = INPUT.split('\n').map(v => v.split(''));
const X_MAX = INITIAL_MAP.length - 1;
const Y_MAX = INITIAL_MAP[0]?.length - 1;

let INIT_X, INIT_Y, INIT_DIR;
let INIT_OBSTACLES = new Set();


const packXY = (x, y) => x * (X_MAX+1) + y;
// const unpackXY = coords => [parseInt(coords / (X_MAX+1)), coords % (X_MAX+1)];

// Save initial state
for (let i = 0; i <= X_MAX; i++)
    for (let j = 0; j <= Y_MAX; j++) {
        if (INITIAL_MAP[i][j] === '^') [INIT_X, INIT_Y, INIT_DIR] = [i, j, INITIAL_MAP[i][j]];
        if (INITIAL_MAP[i][j] === '#') INIT_OBSTACLES.add( packXY(i, j) );
    }

const redirect = {
    '^': '>',
    '>': 'v',
    'v': '<',
    '<': '^',
};

/**
 * @param {{x: Number, y: Number, dir: String}} from
 * @param {Set} obstacles 
 * @return {{x: Number, y: Number, dir: String}}?
 * @nullable 
 */
function move(from, obstacles) {
    // if (from === null) return null; // extra precaution
    let {x, y, dir} = from;
    switch (dir) {
        case '^': x -= 1; break;
        case '>': y += 1; break;
        case 'v': x += 1; break;
        case '<': y -= 1; break;
    }

    if (x < 0 || y < 0 || x > X_MAX || y > Y_MAX)
        return null;

    // Obstacle: rotate
    if ( obstacles.has( packXY(x, y) ) ) {
        dir = redirect[dir];
        // Note: DO NOT step in rotation direction,
        // there could be more than one consequent rotations
        x = from.x;
        y = from.y;
    }
    return {x, y, dir};
};


// Part 1
// List of steps will also be used in the Part 2
const steps = new Set();
steps.add( packXY(INIT_X, INIT_Y) ); // add initial position
let footmark = {x: INIT_X, y: INIT_Y, dir: INIT_DIR};
while (footmark = move(footmark, INIT_OBSTACLES)) 
    steps.add( packXY(footmark.x, footmark.y) );

console.log(steps.size); // Part 1 result


// Part 2
// Intentionally remove the starting position
steps.delete( packXY(INIT_X, INIT_Y) );

let loopsCount = 0;
steps.forEach(obstacle => {   
    // const [oX, oY] = unpackXY(obstacle);

    // Map to save footprint directions
    const footprints = new Map();

    // Add obstacle to test
    INIT_OBSTACLES.add(obstacle);

    // Starting position
    let footmark = {x: INIT_X, y: INIT_Y, dir: INIT_DIR};

    while (footmark = move(footmark, INIT_OBSTACLES)) {
        let footCoords = packXY(footmark.x, footmark.y);

        // If we alreade walked here in the same direction, that's a loop
        if (footprints.get(footCoords) === footmark.dir) {
            loopsCount++;
            break;
        };

        // It is important NOT to rewrite previously walked direction, so only the first walk dir should be stored
        if ( !footprints.has(footCoords) ) {
            // Mark the map with current direction to detect loops
            footprints.set(footCoords, footmark.dir);
        }
    }

    INIT_OBSTACLES.delete(obstacle);
});

console.log(loopsCount);
