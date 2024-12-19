// Day 7

import fs from 'node:fs/promises';
const INPUT = await fs.readFile('./input/7.txt', { encoding: 'utf8' });

const RECORDS = INPUT.split('\n').map(r => {
    let [total, list] = r.split(': ');
    return [parseInt(total), list.split(' ').map(Number)];
});


function generatePermutations(n, base) {
    if (!base) base = 2;
    const digit = (base - 1).toString();
  
    // Max integer of the requested base of the length = n
    var maxN = parseInt(digit.repeat(n), base);
  
    const states = [];
    // For every int between 0 and max integer of that base
    for (let i = 0; i <= maxN; i++) {
        // Convert to binary, pad with 0, and push to the result
        states.push( i.toString(base).padStart(n, '0').split('') );
    }
  
    return states;
}


// Part 1
const correct = RECORDS.filter(r => {
    let [total, list] = r;
    const opsPermutations = generatePermutations(list.length - 1);

    for (const ops of opsPermutations) {
        const val = ops.reduce((val, op, i) => {
            // It is safe to expect i+1 from the list: ops will allways be one less than the list
            const next = list[i + 1];
            return op === '0' ? val + next : val * next;
        }, list[0]);
        if (val === total) return true;
    }
    
    return false;
});

const res = correct.map(r => r[0]).reduce((sum, n) => {sum += n; return sum;}, 0);
console.log(res);


// Part 2
const correct2 = RECORDS.filter(r => {
    let [total, list] = r;
    const opsPermutations = generatePermutations(list.length - 1, 3);

    for (const ops of opsPermutations) {
        const val = ops.reduce((val, op, i) => {
            // It is safe to expect i+1 from the list: ops will allways be one less than the list
            const next = list[i + 1];
            switch (op) {
                case '0': return val + next;
                case '1': return val * next;
                case '2': return val * (10 ** next.toString().length) + next;
            }
        }, list[0]);
        if (val === total) return true;
    }
    
    return false;
});

const res2 = correct2.map(r => r[0]).reduce((sum, n) => {sum += n; return sum;}, 0);
console.log(res2);
