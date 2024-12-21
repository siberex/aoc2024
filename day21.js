// Day 21

import fs from 'node:fs/promises';

import {manhattan} from './_astar.js';
import {printMap} from './_utils.js';

const DEBUG = true;
const input_filename = DEBUG ? './input/21.test' : './input/21.txt';
const INPUT = await fs.readFile(input_filename, { encoding: 'utf8' });

const DOOR_CODES = INPUT.split('\n').filter(v => v);

console.log(DOOR_CODES);

/*
+---+---+---+
| 7 | 8 | 9 |
+---+---+---+
| 4 | 5 | 6 |
+---+---+---+                       +---+---+                       +---+---+                       +---+---+
| 1 | 2 | 3 |                       | ^ | A |                       | ^ | A |                       | ^ | A |
+---+---+---+                   +---+---+---+                   +---+---+---+                   +---+---+---+
    | 0 | A |                   | < | v | > |                   | < | v | > |                   | < | v | > |
    +---+---+                   +---+---+---+                   +---+---+---+                   +---+---+---+
*/


const NUMPAD = [
    ['7',   '8',    '9'],
    ['4',   '5',    '6'],
    ['1',   '2',    '3'],
    [null,  '0',    'A'],
];

const MAP_NUMPAD = new Map();
const NUMPAD_MAP = new Map();
NUMPAD.map((row, y) => row.map((key, x) => {
    MAP_NUMPAD.set([x, y], key);
    NUMPAD_MAP.set(key, [x, y]);
}));

// console.log('MAP_NUMPAD', MAP_NUMPAD); // debug
// console.log('NUMPAD_MAP', NUMPAD_MAP); // debug

const ARROWPAD = [
    [null,  '^',    'A'],
    ['<',   'v',    '>'],
];

const MAP_ARROWPAD = new Map();
const ARROWPAD_MAP = new Map();
ARROWPAD.map((row, y) => row.map((key, x) => {
    MAP_ARROWPAD.set([x, y], key);
    ARROWPAD_MAP.set(key, [x, y]);
}));


function sequenceNumpad(code) {
    let pos = NUMPAD_MAP.get('A');
    let commands = '';
    code.split('').forEach(targetKey => {
        const [x0, y0] = pos;
        const [x, y] = NUMPAD_MAP.get(targetKey);    
        const dx = x - x0, 
              dy = y - y0;
    
        if (dx === 0 && dy === 0) {
            // NOOP
        } else if (dx === 0) {
            if (dy > 0) commands += 'v'.repeat(dy);
            if (dy < 0) commands += '^'.repeat(-dy);
        } else if (dy === 0) {
            if (dx > 0) commands += '>'.repeat(dx);
            if (dx < 0) commands += '<'.repeat(-dx);
        } else {
            if (dx > 0 && dy > 0) {
                commands += '>'.repeat(dx);     // important to first move horizontally
                commands += '^'.repeat(dy);
            } else if (dx < 0 && dy < 0) {
                commands += '^'.repeat(-dy);    // important to first move vertically
                commands += '<'.repeat(-dx);
            } else if (dx < 0 && dy > 0) {
                commands += '<'.repeat(-dx);
                commands += 'v'.repeat(dy);
            } else if (dx > 0 && dy < 0) {
                commands += '>'.repeat(dx);
                commands += '^'.repeat(-dy);
            }
        }
    
        commands += 'A';
        pos = [x, y];
        // console.log(commands); // debug
    });
    return commands;
}

function sequenceArrowpad(code) {
    let pos = ARROWPAD_MAP.get('A');
    let commands = '';
    code.split('').forEach(targetKey => {
        const [x0, y0] = pos;
        const [x, y] = ARROWPAD_MAP.get(targetKey);    
        const dx = x - x0, 
              dy = y - y0;
    
        if (dx === 0 && dy === 0) {
            // console.log('YARR');
            // NOOP
        } else if (dx === 0) {
            if (dy > 0) commands += 'v'.repeat(dy);
            if (dy < 0) commands += '^'.repeat(-dy);
        } else if (dy === 0) {
            if (dx > 0) commands += '>'.repeat(dx);
            if (dx < 0) commands += '<'.repeat(-dx);
        } else {
            if (dx > 0 && dy > 0) {
                commands += '>'.repeat(dx);
                commands += '^'.repeat(dy);
            } else if (dx < 0 && dy < 0) {
                commands += '^'.repeat(-dy);
                commands += '<'.repeat(-dx);
            } else if (dx < 0 && dy > 0) {
                commands += 'v'.repeat(dy);     // important to first move vertically
                commands += '<'.repeat(-dx);
            } else if (dx > 0 && dy < 0) {
                commands += '>'.repeat(dx);     // important to first move horizontally
                commands += '^'.repeat(-dy);
            }
        }
    
        commands += 'A';
        pos = [x, y];
        // console.log(commands); // debug
    });
    return commands;
}



let total = 0;
DOOR_CODES.forEach(code => {
    const codeNumeric = Number( code.replace('A', '') );

    const seqMy = '';

    const complexity = seqMy.length * codeNumeric;
    total += complexity;
});
// console.log(total);
// 288800 — answer is too high


// '379A' last sequence length is wrong!
// expected 64, NOT 68

// 379A: <v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
//   MY: v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA^<A>Av<A>^AA<A>Av<A<A>>^AAAvA^<A>A

const code = '379A';

const codeNumeric = Number( code.replace('A', '') );

const seqN = sequenceNumpad(code);
console.log( seqN );

const seqA = sequenceArrowpad(seqN);
console.log( seqA );

const seqMy = sequenceArrowpad(seqA);
console.log( seqMy, seqMy.length );

const complexity = seqMy.length * codeNumeric;
console.log( seqMy.length, codeNumeric, complexity );
// console.log( complexity );


