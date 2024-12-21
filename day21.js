// Day 21

import fs from 'node:fs/promises';

import {manhattan} from './_astar.js';
import {printMap} from './_utils.js';

const DEBUG = false;
const input_filename = DEBUG ? './input/21.test' : './input/21.txt';
const INPUT = await fs.readFile(input_filename, { encoding: 'utf8' });

const DOOR_CODES = INPUT.split('\n').map(row => row.split(''));


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



let code = '029A'.split('');
let codeNumeic = Number( code.join('').replace('A', '') );

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

console.log('MAP_NUMPAD', MAP_NUMPAD); // debug
console.log('NUMPAD_MAP', NUMPAD_MAP); // debug

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


let pos = NUMPAD_MAP.get('A');

code.forEach(targetKey => {
    const [x0, y0] = pos;
    const [x, y] = NUMPAD_MAP.get(targetKey);
    
    const dx = x - x0;
    const dy = y - y0;

    let commands = '';

    if (dx === 0) {
        if (dy > 0) commands += 'v'.repeat(dy);
        if (dy < 0) commands += '^'.repeat(-dy);
    } else if (dy === 0) {
        if (dx > 0) commands += '>'.repeat(dx);
        if (dx < 0) commands += '<'.repeat(-dx);
    } else {
        if (dx > 0 && dy > 0) {
            commands += '>'.repeat(dx); // important to first move horizontally
            commands += '^'.repeat(dy);
        } else if (dx < 0 && dy < 0) {
            commands += '^'.repeat(-dy); // important to first move vertically
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
    console.log(commands);

});





let posA = ARROWPAD_MAP.get('A');

