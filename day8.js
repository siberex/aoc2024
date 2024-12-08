// Day 8

// Note: This one looks kinda similar to the https://adventofcode.com/2019/day/10

import fs from 'node:fs/promises';
const INPUT = await fs.readFile('./input/8.txt', { encoding: 'utf8' });

const ANTENNAS = INPUT.split('\n').map(r => r.split(''));
const WIDTH = ANTENNAS.length;
const HEIGHT = ANTENNAS[0]?.length;

const isOutOfBounds = (x, y) => x < 0 || y < 0 || x > WIDTH - 1 || y > HEIGHT - 1;

const ANT_COORDS = new Map();

ANTENNAS.forEach((row, i) => {
    row.forEach((freq, j) => {
        if (freq === '.') return;
        if (ANT_COORDS.has(freq))
            ANT_COORDS.get(freq).push([i, j]);
        else 
            ANT_COORDS.set(freq, [ [i, j] ]);
    });
});
// console.log(ANT_COORDS); // debug


let mapAntinodes = structuredClone(ANTENNAS); // Part 1
let mapHarmonics = structuredClone(ANTENNAS); // Part 2

for (let [ant, listCoords] of ANT_COORDS.entries()) {
    for (let i = 0; i < listCoords.length; i++) {
        for (let j = i; j < listCoords.length; j++) {
            let [x1, y1] = listCoords[i];
            let [x2, y2] = listCoords[j];
            
            const dx = x2 - x1;
            const dy = y2 - y1;
            
            if (dx === 0 && dy === 0) continue;
    
            mapHarmonics[x1][y1] = '#';
            mapHarmonics[x2][y2] = '#';

            x1 -= dx;
            y1 -= dy;

            x2 += dx;
            y2 += dy;

            if (!isOutOfBounds(x2, y2)) {
                if (ANTENNAS[x2][y2] !== ant)
                    mapAntinodes[x2][y2] = '#';
            }
            if (!isOutOfBounds(x1, y1)) {
                if (ANTENNAS[x1][y1] !== ant)
                    mapAntinodes[x1][y1] = '#';
            }

            while (!isOutOfBounds(x2, y2)) {
                if (ANTENNAS[x2][y2] !== ant) mapHarmonics[x2][y2] = '#';
                x2 += dx;
                y2 += dy;
            }
            while (!isOutOfBounds(x1, y1)) {
                if (ANTENNAS[x1][y1] !== ant) mapHarmonics[x1][y1] = '#';
                x1 -= dx;
                y1 -= dy;
            }
        }
    }
};

// Part 1
const mapAntinodesPrint = mapAntinodes.map(row => row.join('')).join('\n');
// console.log(mapAntinodesPrint); // Show map
console.log( mapAntinodesPrint.match(/#/g)?.length );


// Part 2
const mapHarmonicsPrint = mapHarmonics.map(row => row.join('')).join('\n');
// console.log(mapHarmonicsPrint); // Show map
console.log( mapHarmonicsPrint.match(/#/g)?.length );
