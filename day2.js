// Day 2

import fs from 'node:fs/promises';
const INPUT = await fs.readFile('./input/2.txt', { encoding: 'utf8' });

const reports = INPUT.split("\n").filter(v => v).map(v => v.split(/\s+/).map(Number));

function is_safe(lvl) {
    const is_increasing = (lvl[1] - lvl[0]) > 0;
    for (let i = 1; i < lvl.length; i++) {
        const diff = lvl[i] - lvl[i - 1];
        if ( diff === 0
            || Math.abs(diff) > 3
            || ( is_increasing && diff < 0 )
            || ( !is_increasing && diff > 0 )
        ) return false;
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
