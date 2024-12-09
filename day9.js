// Day 9

import fs from 'node:fs/promises';

// const INPUT = '12345';
const INPUT = await fs.readFile('./input/9.test', { encoding: 'utf8' });

const DATA = INPUT.split('').map(Number);



let id = 0;
let pos = 0;
let files = [];
let space = [];
let blocks = [];
for (let i = 0; i < DATA.length; i++) {
    const size = DATA[i];
    let block = [];

    if (i % 2 === 0) {
        // File
        files.push({
            id,
            pos,
            size,
        });

        block = Array(size).fill({id}, 0, size);

        id++;
    } else {
        // Free space
        if (size) space.push({
            id: id - 1, // id after
            pos,
            size,
        });

        block = Array(size).fill(null, 0, size);

    }
    pos += DATA[i];
    blocks = blocks.concat(block);
}

// console.log(files);
// console.log(space);

// const fsPrint = blocks.map(b => b ? b.id.toString()[0] : '.').join('');
// console.log(fsPrint);

// Part 1

/*
for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b === null) {
        let lastFileBlock = null;
        let lastFileBlockIndex = null;

        // find last block with file id
        for (let j = blocks.length - 1; j > i; j--) {
            if (blocks[j] !== null) {
                lastFileBlockIndex = j;
                lastFileBlock = blocks[j];
                break;
            }
        }

        if (lastFileBlock) {
            blocks[i] = lastFileBlock;
            blocks[lastFileBlockIndex] = null;
        }
    }
}
// const fsPrint2 = blocks.map(b => b ? b.id.toString()[0] : '.').join('');
// console.log(fsPrint2);

let checksum = 0;
for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b) checksum += b.id * i;
}

console.log(checksum);
*/

// Part 2


for (let spaceIndex = 0; spaceIndex < space.length; spaceIndex++) {
    let s = space[spaceIndex];

    for (let fileIndex = files.length - 1; fileIndex > spaceIndex; fileIndex--) {
        let f = files[fileIndex];
        if (f.size === 0) continue;

        if (s.size >= f.size) {
            for (let i = f.pos; i < f.pos + f.size; i++) {
                blocks[i] = null;
            }
            for (let i = s.pos; i < s.pos + Math.min(f.size, s.size); i++) {
                blocks[i] = {id: f.id};
            }
    
            s.size -= f.size;
            s.pos += f.size;
            f.size = 0;
            // if (s.size > 0) {
            //     --spaceIndex;
            // }
        }
    }

};


// const fsPrint2 = blocks.map(b => b ? b.id.toString()[0] : '.').join('');
// console.log(fsPrint2);

let checksum = 0;
for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b) checksum += b.id * i;
}

console.log(checksum);

// OOPS
// 8648369083555
// your answer is too high

// 6480505549442
// your answer is too high



// console.log(space);
