// Day 5.

import fs from 'node:fs/promises';
const INPUT = await fs.readFile('./input/5.txt', { encoding: 'utf8' });

let [rules_raw, updates_raw] = INPUT.split("\n\n").map(v => v.split("\n"));


//let rules = rules.map(r => r.split("|").map(Number)).map(tuple => ({[tuple[0]]: tuple[1]}));
let rules = rules_raw.map(r => r.split("|").map(Number));
let updates = updates_raw.map(u => u.split(',').map(Number));

let after = rules.reduce((pagesAfter, rule) => {let [k, v] = rule; pagesAfter[k] ? pagesAfter[k].push(v) : pagesAfter[k] = [v]; return pagesAfter;}, {});
let before = rules.reduce((pagesBefore, rule) => {let [v, k] = rule; pagesBefore[k] ? pagesBefore[k].push(v) : pagesBefore[k] = [v]; return pagesBefore;}, {});


// Part 1
let correct = updates.filter(update => {
    let misplacedPages = update.filter(
        (page, i) => update.slice(i).filter(v => before[page]?.includes(v)).length
    );
    return !misplacedPages.length;
});

let res1 = correct.map(u => u[parseInt(u.length/2)]).reduce((acc, v) => acc + v, 0);
console.log(res1);


// Part 2
let incorrect = updates.filter(update => {
    let misplacedPages = update.filter(
        (page, i) => update.slice(i).filter(v => before[page]?.includes(v)).length
    );
    return misplacedPages.length;
});

// structuredClone for in-place modifications
correct = structuredClone(incorrect).map(update => {
    for (let i = 0; i < update.length; i++) {
        const page = update[i];
        for (let j = i; j < update.length; j++) {
            const pageAfter = update[j];
            if (before[page]?.includes(pageAfter)) {
                update[i] = pageAfter;
                update[j] = page;
                i--; // Repeat swapped page check
                break;
            }
        }
    }
    // Reverse check:
    // for (let i = update.length - 1; i > 0; i--) {
    //     const page = update[i];
    //     for (let j = i - 1; j > 0; j--) {
    //         const pageBefore = update[j];
    //         if (after[page]?.includes(pageBefore)) {
    //             update[i] = pageBefore;
    //             update[j] = page;
    //             i++;
    //             break;
    //         }
    //     }
    // }
    return update;
});

let res2 = correct.map(u => u[parseInt(u.length/2)]).reduce((acc, v) => acc + v, 0);
console.log(res2);