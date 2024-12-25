// Day 25

import fs from 'node:fs/promises';

const DEBUG = true;
const input_filename = DEBUG ? './input/25.test' : './input/25.txt';
const INPUT = await fs.readFile(input_filename, { encoding: 'utf8' });

const RAW_BLOCKS = INPUT.split('\n\n');

// console.log(RAW_BLOCKS);

const printArr = arr => arr.map(row => row.join('')).join('\n');

const RAW_LOCKS_AND_KEYS = RAW_BLOCKS.map(block => block.split('\n').map(raw => raw.split('')));

// console.log(RAW_LOCKS_AND_KEYS);

const locks_and_keys = RAW_LOCKS_AND_KEYS.map(lock_or_key => {
    // Produce rotated matrice
    const pins_num = 5; // lock_or_key[0].length;
    const pin_length = 7; // lock_or_key.length;
    const rotated = Array(pins_num).fill([], 0, pins_num);

    for (let i = 0; i < pins_num; i++) {
        rotated[i] = Array(pin_length).fill(null, 0, pin_length);
        
        for (let j = 0; j < pin_length; j++) {
        
            rotated[i][j] = lock_or_key[j][i];
        }
    }

    rotated.reverse();

    const isLock = lock_or_key[0].join('') === '#####';
    rotated.isLock = isLock;

    return rotated;
});
// console.log(locks_and_keys);


const locks = locks_and_keys.filter(lock_or_key => lock_or_key.isLock);
const keys = locks_and_keys.filter(lock_or_key => !lock_or_key.isLock);


// console.log('Locks:')
// locks.forEach(lock => console.log( printArr(lock) + '\n' ));

// console.log('Keys:')
// keys.forEach(keys => console.log( printArr(keys) + '\n' ));


const locks_numeric = locks.map(lock_or_key => {
    const numeric = lock_or_key.map(pin => pin.join('').match(/#/g).length - 1);
    numeric.reverse();
    // numeric.isLock = lock_or_key.isLock;
    return numeric;
});

const keys_numeric = keys.map(lock_or_key => {
    const numeric = lock_or_key.map(pin => pin.join('').match(/#/g).length - 1);
    numeric.reverse();
    // numeric.isLock = lock_or_key.isLock;
    return numeric;
});

console.log(locks_numeric);
console.log(keys_numeric);

