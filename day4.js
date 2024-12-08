// Day 4

import fs from 'node:fs/promises';
const INPUT = await fs.readFile('./input/4.txt', { encoding: 'utf8' });

let letters = INPUT.split("\n").map(v => v.split(''));

// Part 1
const diag_length = letters.length + letters[0].length - 1;

const lines = letters.map(l => l.join(''));
const lines_rotated = Array(letters.length).fill('', 0, letters.length);
const lines_diag = Array(diag_length).fill('', 0, diag_length);
const lines_diag_ortho = Array(diag_length).fill('', 0, diag_length);

// Prodice rotated matrices (-45°, 90°, +45°)
for (let i = 0; i < letters.length; i++) {
    for (let j = 0; j < letters[i].length; j++) {
        lines_rotated[i] += letters[j][i];
        let k = i + j;
        if (k < diag_length) lines_diag[k] = letters[i][j] + lines_diag[k];
    }
    for (let j = letters[i].length - 1; j >= 0; j--) {
        let k = i + (letters[i].length - j - 1);
        if (k < diag_length) lines_diag_ortho[k] += letters[i][j];
    }
}

const countWords = (total, line) => total += (line.match(/XMAS/g)?.length || 0) + (line.match(/SAMX/g)?.length || 0);
const res1 = [...lines, ...lines_rotated, ...lines_diag, ...lines_diag_ortho].reduce(countWords, 0);
console.log(res1);

// Part 2
let res2 = 0;
for (let i = 1; i < letters.length - 1; i++) {
    for (let j = 1; j < letters[i].length - 1; j++) {
        if (letters[i][j] === 'A') {
            // Diagonals
            if ( (letters[i - 1][j - 1] === 'M' && letters[i + 1][j + 1] === 'S') 
                 || (letters[i - 1][j - 1] === 'S' && letters[i + 1][j + 1] === 'M') ) {
                if ( (letters[i - 1][j + 1] === 'M' && letters[i + 1][j - 1] === 'S') 
                 || (letters[i - 1][j + 1] === 'S' && letters[i + 1][j - 1] === 'M') ) res2++;
            }
        }
    }
}
console.log(res2);
