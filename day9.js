// Day 9

import fs from 'node:fs/promises';

// const INPUT = '12345';
const INPUT = await fs.readFile('./input/9.txt', { encoding: 'utf8' });

const DATA = INPUT.split('').map(Number);


const getChecksum = blocks => blocks.reduce((checksum, b, i) => b !== null ? checksum + b * i : checksum, 0);

let pos = 0;
const files = [];
const space = [];
let INIT_BLOCKS = [], blocks = [];
DATA.forEach((size, i) => {
    let block = Array(size);
    const item = {
        id: i >> 1,
        pos,
        size,
    };

    if (i % 2 === 0) {
        // File
        files.push(item);
        block = block.fill(item.id, 0, size);
    } else {
        // Free space
        if (size) space.push(item);
        block = block.fill(null, 0, size);
    }
    pos += size;
    INIT_BLOCKS = INIT_BLOCKS.concat(block);
});

// console.log(files.length);
// console.log(space.length);
// console.log( INIT_BLOCKS.map(id => id !== null ? id.toString()[0] : '.').join('') );


// Part 1
blocks = structuredClone(INIT_BLOCKS);
blocks.forEach((b, i) => {
    if (b !== null) return; // Skip non-empty blocks
    // Find the last block assigned to file and not empty space
    const lastFileBlockIndex = blocks.findLastIndex((bb, j) => bb !== null && j > i);

    // Switch empty block with file block
    if (lastFileBlockIndex !== -1) {
        blocks[i] = blocks[lastFileBlockIndex];
        blocks[lastFileBlockIndex] = null;
    }
});
// console.log( blocks.map(id => id !== null ? id.toString()[0] : '.').join('') ); // debug
console.log(getChecksum(blocks));


// Part 2
blocks = structuredClone(INIT_BLOCKS);
space.forEach(s => {
    let f = files.findLast(f => (f.size > 0) && (s.size >= f.size) && (s.pos < f.pos));
    if (f === undefined) return;

    // While space block not exhausted, move there last suitable file block
    while (s.size > 0 && f !== undefined) {

        for (let i = f.pos; i < f.pos + f.size; i++) {
            blocks[i] = null;
        }
        for (let i = s.pos; i < s.pos + Math.min(f.size, s.size); i++) {
            blocks[i] = f.id;
        }

        s.size -= f.size;
        s.pos += f.size;
        f.size = 0;

        f = files.findLast(f => (f.size > 0) && (s.size >= f.size) && (s.pos < f.pos));
    }

});

// console.log( blocks.map(id => id !== null ? id.toString()[0] : '.').join('') ); // debug
console.log(getChecksum(blocks));
