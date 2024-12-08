// Day 1

import fs from 'node:fs/promises';
const INPUT = await fs.readFile('./input/1.txt', { encoding: 'utf8' });

// list of tuples
const lists = INPUT.split("\n").map(v => v.split(/\s+/).map(Number));

// put each part of the tuple to it's own list
const list1 = [];
const list2 = [];
lists.forEach(tuple => {
  list1.push(tuple.at(0));
  list2.push(tuple.at(1));
});

// Part1
// sort and count distances
const list1_sorted = list1.toSorted();
const list2_sorted = list2.toSorted();
const res1 = list1_sorted
    .map( (v, i) => Math.abs(v - list2_sorted.at(i)) )
    .reduce((acc, v) => acc + v, 0);

console.log(res1);


// Part2
// count unique occurences in the right list
const map_right = list2_sorted.reduce(
    (acc, v) => acc.set(v, (acc.get(v) || 0) + 1),
    new Map()
);

// multiply left values by occurences in the right list and sum
const res2 = list1_sorted.reduce((acc, v) => acc + v * (map_right.get(v) || 0), 0);

console.log(res2);
