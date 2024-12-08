// Day 1.
const INPUT = `...`;
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
const result = list1_sorted.map( (v, i) => Math.abs(v - list2_sorted.at(i)) )
  .reduce((acc, v) => acc + v, 0);

// Part2
// count unique occurences in the right list
const map_right = list2sorted.reduce( (acc, v) => acc.set(v, (acc.get(v) || 0) + 1), new Map());
// multiply left values by occurences in the right list and sum
list1_sorted.reduce((acc, v) => acc + v * (map_right.get(v) || 0), 0)



// Day 2.
const INPUT = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;
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
const safe_reports = reports.filter(is_safe);
safe_reports.length;

// Part2
const safe_reports = reports.filter(lvl => {
    if (is_safe(lvl)) return true;
    for (let i = 0; i < lvl.length; i++) {
      if ( is_safe(lvl.toSpliced(i, 1)) ) return true;
    }
    return false;
});
safe_reports.length;



// Day 3.
const INPUT = await fetch('https://adventofcode.com/2024/day/3/input')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        return response.text();
    })
    .catch(err => console.error(err.message));


// Part 1
INPUT.match(/mul\(\d{1,3},\d{1,3}\)/g)
    .map(v => {const [a, b] = v.match(/\d+/g).map(Number); return a*b; } )
    .reduce((acc, v) => acc + v, 0);

// Part 2
const instructions = INPUT.match(/mul\(\d{1,3},\d{1,3}\)|do\(\)|don\'t\(\)/g);

let result = 0;
let enable = true;
for (instruction of instructions) {
    if (instruction == `do()`) { enable = true; continue; }
    if (instruction == `don't()`) { enable = false; continue; }
    if (enable) {
        const [a, b] = instruction.match(/\d+/g).map(Number);
        result += a*b;
    }
};



// Day 4
const INPUT = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;

const INPUT = await fetch('https://adventofcode.com/2024/day/4/input')
    .then(response => response.text())
    .catch(err => console.error(err));

let letters = INPUT.split("\n").map(v => v.split(''));

// Part 1
const diag_length = letters.length + letters[0].length - 1;

let lines = letters.map(l => l.join(''));
let lines_rotated = Array(letters.length).fill('', 0, letters.length);
let lines_diag = Array(diag_length).fill('', 0, diag_length);
let lines_diag_ortho = Array(diag_length).fill('', 0, diag_length);

for (let i = 0; i < letters.length; i++) {
    for (let j = 0; j < letters[i].length; j++) {
        lines_rotated[i] += letters[j][i];
        let k = i + j;
        if (k < diag_length) lines_diag[k] = letters[i][j] + lines_diag[k];
    }
    for (let j = letters[i].length - 1; j >= 0; j--) {
        let k = i + (letters[i].length - j - 1);
        if (k < diag_length) lines_diag_ortho[k] += letters[i][j];
    }
}

const countWords = (total, line) => total += (line.match(/XMAS/g)?.length || 0) + (line.match(/SAMX/g)?.length || 0);
const res1 = [...lines, ...lines_rotated, ...lines_diag, ...lines_diag_ortho].reduce(countWords, 0);
console.log(res1);

// Part 2
let res2 = 0;
for (let i = 1; i < letters.length - 1; i++) {
    for (let j = 1; j < letters[i].length - 1; j++) {
        if (letters[i][j] === 'A') {
            // Diagonals
            if ( (letters[i - 1][j - 1] === 'M' && letters[i + 1][j + 1] === 'S') 
                 || (letters[i - 1][j - 1] === 'S' && letters[i + 1][j + 1] === 'M') ) {
                if ( (letters[i - 1][j + 1] === 'M' && letters[i + 1][j - 1] === 'S') 
                 || (letters[i - 1][j + 1] === 'S' && letters[i + 1][j - 1] === 'M') ) res2++;
            }
        }
    }
}
console.log(res2);
