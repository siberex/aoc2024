// Day 2

import fs from 'node:fs/promises';
const INPUT = await fs.readFile('./input/2.txt', { encoding: 'utf8' });

const reports = INPUT.split("\n").map(v => v.split(/\s+/).map(Number));

function is_safe(lvl) {
    const is_increasing = (lvl[1] - lvl[0]) > 0;
    for (let i = 1; i < lvl.length; i++) {
        if ( Math.abs(lvl[i] - lvl[i-1]) > 3
             || lvl[i-1] == lvl[i]
             || ( is_increasing && lvl[i-1] > lvl[i] )
             || ( !is_increasing && lvl[i-1] < lvl[i]) ) return false;
    }
    return true;
}


// Part1
console.log(reports.filter(is_safe).length);


// Part2
const safe_reports = reports.filter(lvl => {
    if (is_safe(lvl)) return true;
    for (let i = 0; i < lvl.length; i++) {
        if ( is_safe(lvl.toSpliced(i, 1)) ) return true;
    }
    return false;
});
console.log(safe_reports.length);
