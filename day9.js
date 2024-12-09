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

// console.log(files);
// console.log(space);
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
for (let fileIndex = files.length - 1; fileIndex > 0; fileIndex--) {
    let f = files[fileIndex];
    if (f.size === 0) continue;

    space.forEach(s => {
        if (s.size >= f.size && s.pos < f.pos) {
            for (let i = f.pos; i < f.pos + f.size; i++) {
                blocks[i] = null;
            }
            for (let i = s.pos; i < s.pos + Math.min(f.size, s.size); i++) {
                blocks[i] = f.id;
            }
    
            s.size -= f.size;
            s.pos += f.size;
            f.size = 0;
        }
    });
};

// console.log( blocks.map(id => id !== null ? id.toString()[0] : '.').join('') ); // debug
console.log(getChecksum(blocks));
