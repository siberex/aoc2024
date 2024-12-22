// Day 21

import fs from 'node:fs/promises';

import {manhattan} from './_astar.js';
import {printMap} from './_utils.js';

const DEBUG = true;
const input_filename = DEBUG ? './input/21.test' : './input/21.txt';
const INPUT = await fs.readFile(input_filename, { encoding: 'utf8' });

const DOOR_CODES = INPUT.split('\n').filter(v => v);

console.log(DOOR_CODES);

// ^A<<^^A>>AvvvA
//  3

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


/*
379A:
✓
^   A   ^   ^   <   <   A       >   >   A   v   v   v   A
✓
<A  >A  <A  A   v<A A   >>^A    vA  A   ^A  v<A A   A   >^A


<       A       >   A   <       A       A   v       <   A       A   >   >   ^       A   v   A   A   ^   A   v   <   A       A   A   >   ^   A
v<<A    >>^A    vA  ^A  v<<A    >>^A    A   v<A     <A  >>^A    A   vA  A   <^A     >A  v<A >^A A   <A  >A  v<A <A  >>^A    A   A   vA  <^A >A

replace v<A with <vA:
<       A       >   A   <       A       A   <       v   A   A   >   >   ^   A   v   A   A   ^   A   <       v   A   A   A   >   ^   A
v<<A    >>^A    vA  ^A  v<<A    >>^A    A   v<<A    >A  >^A A   vA  A   <^A >A  v<A >^A A   <A  >A  v<<A    >A  >^A A   A   vA  <^A >A


*/




/*

379A:
^A^^<<A>>AvvvA
<A>A<AAv<AA>>^AvAA^A<vAAA>^A
v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^AA<A>Av<<A>A>^AAAvA<^A>A


029A:
<A^A>^^AvvvA
v<<A>>^A<A>AvA<^AA>A<vAAA>^A
<vA<AA>>^AvAA<^A>A v<<A >>^AvA^A<vA>^A v<<A >^A>AAvA^A v<<A >A>^AAAvA<^A>A

Expected:
<vA<AA>>^AvAA<^A>A <v<A >>^AvA^A<vA>^A <v<A >^A>AAvA^A <v<A >A>^AAAvA<^A>A
v<<A>>^A<A>AvA<^AA>A<vAAA>^A
<A^A>^^AvvvA



029A:
✓ <A^A>^^AvvvA

<       A       ^   A   >   ^   ^   A   v   v v A
v<<A    >>^A    <A  >A  vA  <^A A   >A  v<A A A >^A

v<<A>>^A<A>AvA<^AA>Av<AAA>^A
v<A<AA>>^AvAA<^A>Av<<A>>^AvA^Av<A>^Av<<A>^A>AAvA^Av<A<A>>^AAAvA<^A>A


<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A
v<<A>>^A<A>AvA<^AA>A<vAAA>^A
✓ <A^A>^^AvvvA
029A
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
    MAP_NUMPAD.set(`${x}.${y}`, key);
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
    MAP_ARROWPAD.set(`${x}.${y}`, key);
    ARROWPAD_MAP.set(key, [x, y]);
}));


function getArrowButtons(sequence) {
    let pos = ARROWPAD_MAP.get('A');
    let result = '';
    sequence.split('').forEach(move => {
        let [x, y] = pos;
        if (move === '^') y -= 1;
        if (move === 'v') y += 1;
        if (move === '<') x -= 1;
        if (move === '>') x += 1;
        if (MAP_ARROWPAD.get(`${x}.${y}`) === null) throw new Error('SEGFAULT!!!');
        if (move === 'A')
            result += MAP_ARROWPAD.get(`${x}.${y}`);
        pos = [x, y];
    });

    return result;
}

function getNumpadButtons(sequence) {
    let pos = NUMPAD_MAP.get('A');
    let result = '';
    sequence.split('').forEach(move => {
        let [x, y] = pos;
        if (move === '^') y -= 1;
        if (move === 'v') y += 1;
        if (move === '<') x -= 1;
        if (move === '>') x += 1;
        if (MAP_NUMPAD.get(`${x}.${y}`) === null) throw new Error('SEGFAULT!!!');
        if (move === 'A')
            result += MAP_NUMPAD.get(`${x}.${y}`);
        pos = [x, y];
    });

    return result; 
}


function cmdVariationsAppend(variations, cmd) {
    return variations.map(variant => variant + cmd);
}

class Variations {
    constructor() {
        this.variations = [];
    }

    add(items) {
        if (Array.isArray(items)) {
            // Array: number of variations should be multiplied by items.length
            if (this.variations.length === 0) {
                this.variations = items;
            } else {
                this.variations = items.flatMap(
                    item => this.variations.map(variation => variation + item)
                );
            }
        } else {
            // String, simply append it to all variations
            if (this.variations.length === 0) {
                // First item, create first variation;
                this.variations = [items];
            } else {
                this.variations = this.variations.map(variation => variation + items);
            }
        }
    }
}

/*
const v = new Variations();
v.add('123_');
v.add(['branchA', 'branchB']);
v.add('_456_');
v.add(['branchC', 'branchD']);
v.add('_789');
console.log(v.variations);
process.exit();
*/


function sequenceNumpadVariations(code) {
    const [nullX, nullY] = NUMPAD_MAP.get(null);
    const commands = new Variations();
    let pos = NUMPAD_MAP.get('A');
    code.split('').forEach(targetKey => {
        const [x0, y0] = pos;
        const [x, y] = NUMPAD_MAP.get(targetKey);    
        const dx = x - x0, 
              dy = y - y0;

        if (dx === 0 && dy === 0) {
            // NOOP
        } else if (dx === 0) {
            if (dy > 0) commands.add('v'.repeat(dy));
            if (dy < 0) commands.add('^'.repeat(-dy));
        } else if (dy === 0) {
            if (dx > 0) commands.add('>'.repeat(dx));
            if (dx < 0) commands.add('<'.repeat(-dx));
        } else {
            if (dx > 0 && dy > 0) {
                if (x === nullX) {
                    // important to first move horizontally
                    commands.add('>'.repeat(dx) + 'v'.repeat(dy));
                } else {
                    commands.add([
                        '>'.repeat(dx) + 'v'.repeat(dy),
                        'v'.repeat(dy) + '>'.repeat(dx),
                    ]);
                }
            } else if (dx < 0 && dy < 0) {
                if (y === nullY) {
                    // important to first move vertically
                    commands.add('^'.repeat(-dy) + '<'.repeat(-dx));
                } else {
                    commands.add([
                        '^'.repeat(-dy) + '<'.repeat(-dx),
                        '<'.repeat(-dx) + '^'.repeat(-dy),
                    ]);
                }
            } else if (dx < 0 && dy > 0) {
                commands.add([
                    '<'.repeat(-dx) + 'v'.repeat(dy),
                    'v'.repeat(dy) + '<'.repeat(-dx),
                ]);
            } else if (dx > 0 && dy < 0) {
                commands.add([
                    '>'.repeat(dx) + '^'.repeat(-dy),
                    '^'.repeat(-dy) + '>'.repeat(dx),
                ]);
            }
        }

        commands.add('A');
        pos = [x, y];
        // console.log(commands); // debug
    });
    
    return commands.variations;
}

function sequenceArrowpadVariations(code) {
    const [nullX, nullY] = ARROWPAD_MAP.get(null);
    const commands = new Variations();
    let pos = ARROWPAD_MAP.get('A');
    code.split('').forEach(targetKey => {
        const [x0, y0] = pos;
        const [x, y] = ARROWPAD_MAP.get(targetKey);    
        const dx = x - x0, 
              dy = y - y0;

        if (dx === 0 && dy === 0) {
            // NOOP
        } else if (dy === 0) {
            if (dx > 0) commands.add('>'.repeat(dx));
            if (dx < 0) commands.add('<'.repeat(-dx));
        } else if (dx === 0) {
            if (dy > 0) commands.add('v'.repeat(dy));
            if (dy < 0) commands.add('^'.repeat(-dy));
        } else {
            if (dx > 0 && dy > 0) {
                commands.add([
                    '>'.repeat(dx) + '^'.repeat(dy),
                    '^'.repeat(dy) + '>'.repeat(dx),
                ]);
            } else if (dx < 0 && dy < 0) {
                commands.add([
                    '<'.repeat(-dx) + '^'.repeat(-dy),
                    '^'.repeat(-dy) + '<'.repeat(-dx),
                ]);
            } else if (dx < 0 && dy > 0) {
                if (x === nullX) {
                    // important to first move vertically
                    commands.add('v'.repeat(dy) + '<'.repeat(-dx));
                } else {
                    commands.add([
                        'v'.repeat(dy) + '<'.repeat(-dx),
                        '<'.repeat(-dx) + 'v'.repeat(dy),
                    ]);
                }
            } else if (dx > 0 && dy < 0) {
                if (x === nullX) {
                    // important to first move horizontally
                    commands.add('>'.repeat(dx) + '^'.repeat(-dy));
                } else {
                    commands.add([
                        '>'.repeat(dx) + '^'.repeat(-dy),
                        '^'.repeat(-dy) + '>'.repeat(dx),
                    ]);
                }
            }
        }

        commands.add('A');
        pos = [x, y];
        // console.log(commands); // debug
    });
    return commands.variations;
}


/*
let total = 0;
DOOR_CODES.forEach(code => {
    const codeNumeric = Number( code.replace('A', '') );

    const seqN = sequenceNumpadVariations(code)[0];
    // console.log( seqN );
    
    const seqA = sequenceArrowpadVariations(seqN)[0];
    // console.log( seqA );
    
    const seqMy = sequenceArrowpadVariations(seqA)[0];
    // console.log( seqMy, seqMy.length );
    
    const complexity = seqMy.length * codeNumeric;
    console.log( `${code}: ${seqMy.length} × ${codeNumeric} = ${complexity}\n` );

    const arrows1 = getArrowButtons(seqMy);
    // console.log('Verify:');
    // console.log( arrows1 );
    
    const arrows2 = getArrowButtons(arrows1);
    // console.log( arrows2 );
    
    const numpad = getNumpadButtons(arrows2);
    // console.log( numpad );
    
    total += complexity;
});
console.log(total);
// 288800 — answer is too high
*/

// '379A' last sequence length is wrong!
// expected 64, NOT 68

// 379A: <v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
//   MY: v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA^<A>Av<A>^AA<A>Av<A<A>>^AAAvA^<A>A

/*

My:
379A:
^A ^^<<A >>A vvvA
<A>A <A Av<AA>>^AvAA^A<vAAA>^A
v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^AA<A>Av<<A>A>^AAAvA<^A>A


Expected:
<v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
<A>A v<<AA>^AA>A vAA^A<vAAA>^A
^A <<^^A >>A vvvA
379A


*/

// process.exit();

const code = '379A';

const codeNumeric = Number( code.replace('A', '') );

const seqN = sequenceNumpadVariations(code);
console.log( seqN );

const seqA = sequenceArrowpadVariations(seqN[1]);
console.log( seqA );

const seqMy = sequenceArrowpadVariations(seqA[0]);
console.log( seqMy );

const complexity = seqMy[0].length * codeNumeric;
console.log( `${code}: ${seqMy[0].length} × ${codeNumeric} = ${complexity}\n` );
// console.log( complexity );

console.log('Should be like this:');
const arrows1 = getArrowButtons('<v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A');
console.log( arrows1 );

const arrows2 = getArrowButtons(arrows1);
console.log( arrows2 );

const numpad = getNumpadButtons(arrows2);
console.log( numpad );

/*

LOOKING FOR:
<v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
<A>Av<<AA>^AA>AvAA^A<vAAA>^A
^A<<^^A>>AvvvA
379A

ALL VARIATIONS FOR 379A:

[ '^A^^<<A>>AvvvA' ]
[ '<A>A<AAv<AA>>^AvAA^Av<AAA>^A', '<A>A<AAv<AA>>^AvAA^A<vAAA>^A' ]

  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA<^A>Av<A>^AA<A>Av<A<A>>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA<^A>Av<A>^AA<A>Av<A<A>>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA^<A>Av<A>^AA<A>Av<A<A>>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA^<A>Av<A>^AA<A>Av<A<A>>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA<^A>A<vA>^AA<A>Av<A<A>>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^AA<A>Av<A<A>>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA^<A>A<vA>^AA<A>Av<A<A>>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA^<A>A<vA>^AA<A>Av<A<A>>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA<^A>Av<A>^AA<A>A<vA<A>>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA<^A>Av<A>^AA<A>A<vA<A>>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA^<A>Av<A>^AA<A>A<vA<A>>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA^<A>Av<A>^AA<A>A<vA<A>>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA<^A>A<vA>^AA<A>A<vA<A>>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^AA<A>A<vA<A>>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA^<A>A<vA>^AA<A>A<vA<A>>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA^<A>A<vA>^AA<A>A<vA<A>>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA<^A>Av<A>^AA<A>Av<A<A>>^AAAvA^<A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA<^A>Av<A>^AA<A>Av<A<A>>^AAAvA^<A>A',
  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA^<A>Av<A>^AA<A>Av<A<A>>^AAAvA^<A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA^<A>Av<A>^AA<A>Av<A<A>>^AAAvA^<A>A',
  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA<^A>A<vA>^AA<A>Av<A<A>>^AAAvA^<A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^AA<A>Av<A<A>>^AAAvA^<A>A',
  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA^<A>A<vA>^AA<A>Av<A<A>>^AAAvA^<A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA^<A>A<vA>^AA<A>Av<A<A>>^AAAvA^<A>A',
  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA<^A>Av<A>^AA<A>A<vA<A>>^AAAvA^<A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA<^A>Av<A>^AA<A>A<vA<A>>^AAAvA^<A>A',
  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA^<A>Av<A>^AA<A>A<vA<A>>^AAAvA^<A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA^<A>Av<A>^AA<A>A<vA<A>>^AAAvA^<A>A',
  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA<^A>A<vA>^AA<A>A<vA<A>>^AAAvA^<A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^AA<A>A<vA<A>>^AAAvA^<A>A',
  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA^<A>A<vA>^AA<A>A<vA<A>>^AAAvA^<A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA^<A>A<vA>^AA<A>A<vA<A>>^AAAvA^<A>A'

  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA<^A>Av<A>^AA<A>Av<<A>A>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA<^A>Av<A>^AA<A>Av<<A>A>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA^<A>Av<A>^AA<A>Av<<A>A>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA^<A>Av<A>^AA<A>Av<<A>A>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA<^A>A<vA>^AA<A>Av<<A>A>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^AA<A>Av<<A>A>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA^<A>A<vA>^AA<A>Av<<A>A>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA^<A>A<vA>^AA<A>Av<<A>A>^AAAvA<^A>A',
  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA<^A>Av<A>^AA<A>Av<<A>A>^AAAvA^<A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA<^A>Av<A>^AA<A>Av<<A>A>^AAAvA^<A>A',
  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA^<A>Av<A>^AA<A>Av<<A>A>^AAAvA^<A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA^<A>Av<A>^AA<A>Av<<A>A>^AAAvA^<A>A',
  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA<^A>A<vA>^AA<A>Av<<A>A>^AAAvA^<A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^AA<A>Av<<A>A>^AAAvA^<A>A',
  'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA^<A>A<vA>^AA<A>Av<<A>A>^AAAvA^<A>A',
  'v<<A>>^AvA^Av<<A>>^AA<vA<A>>^AAvAA^<A>A<vA>^AA<A>Av<<A>A>^AAAvA^<A>A'

*/