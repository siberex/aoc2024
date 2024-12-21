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



let code = '029A';

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

console.log(MAP_NUMPAD);
console.log(NUMPAD_MAP);

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


let posN = NUMPAD_MAP.get('A');
let posA = ARROWPAD_MAP.get('A');

