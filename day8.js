// Day 8

// Note: This one looks kinda similar to the https://adventofcode.com/2019/day/10


/*
let INPUT = await fetch('https://adventofcode.com/2024/day/8/input')
    .then(response => response.text())
    .catch(err => console.error(err));
*/

let INPUT = `..................................3.........H.....
..............F............................CK.....
..................F...e...m..........C.Ki.........
......1..................m........................
.........F.1......................................
.......1.....W...........3..Z............i........
...........W...m....1.............................
......W...........m..............N..C.............
E............2................Z.K.......p.........
.....Y.........4....i.........N...................
..............W.Y....................3..9....i....
.................................h........9.......
.........................................Z.......H
2...............................3.......H9........
..2..........4T...................................
...2..............Y...4........Z..................
.........E.........................N...5..........
.......................................e..........
..............................C...................
..E..................P.....................p.H....
......4............................IN......h.p....
..........................T....M.........K..p.....
..........................G.......................
..................................................
...................................M..............
.5.............G..............M...................
.............Y..........................M.........
.................E8...0.........................h.
.............................P............g.......
......5...........................................
.............n.................................c..
...............................g....f.......c.....
.y..............8...t....T........................
..7..F.............T........R..........f........u.
.kz.......7..R....................................
.........8..................U.........P...........
......U.............wG....v.....P.............c...
...0.....R..........g.............................
.....7.....8.........g.............f..............
....z...........G................7................
........5........6.v.....U..f.......u........e....
.........V....v........6......t...................
......6..0..y.....R........V...........r..........
...........v.......we..U.............c..r.........
................................r.......Iu........
k............y6..........t.................r...I..
........k............t...........w................
.............z....n.................I.............
..0.................n.............................
...............n..........V...........y........u..`;


const ANTENNAS = INPUT.split('\n').map(r => r.split(''));
const WIDTH = ANTENNAS.length;
const HEIGHT = ANTENNAS[0]?.length;

const isOutOfBounds = (x, y) => x < 0 || y < 0 || x > (WIDTH - 1) || y > (HEIGHT - 1);

const antinodes = new Set();

const ANT_COORDS = {};

ANTENNAS.forEach((row, i) => {
    row.forEach((loc, j) => {
        if (loc === '.') return;
        if (ANT_COORDS[loc])
             ANT_COORDS[loc].push([i, j]);
        else ANT_COORDS[loc] = [[i, j]];
    });
});
// console.log(ANT_COORDS);


let mapAntinodes1 = structuredClone(ANTENNAS);
for (let [ant, listCoords] of Object.entries(ANT_COORDS)) {    
    for (let i = 0; i < listCoords.length; i++) {
        for (let j = i; j < listCoords.length; j++) {
            let [x1, y1] = listCoords[i];
            let [x2, y2] = listCoords[j];
            
            const dx = x2 - x1;
            const dy = y2 - y1;
    
            x1 -= dx;
            y1 -= dy;

            x2 += dx;
            y2 += dy;

            if (!isOutOfBounds(x2, y2)) {
                if (ANTENNAS[x2][y2] !== ant)
                    mapAntinodes1[x2][y2] = '#';

                // x2 += dx;
                // y2 += dy;
            }
            if (!isOutOfBounds(x1, y1)) {
                if (ANTENNAS[x1][y1] !== ant)
                    mapAntinodes1[x1][y1] = '#';

                // x1 -= dx;
                // y1 -= dy;
            }
        }
    }
};


// console.log(mapAntinodes1.map(row => row.join('')).join('\n')); // Show map
let res1 = mapAntinodes1.map(row => row.join('')).join('\n').match(/#/g)?.length;
console.log(res1);



// let mapAntinodes = Array(WIDTH).fill(null, 0, WIDTH).map(v => Array(HEIGHT).fill('.', 0, HEIGHT));
let mapAntinodes2 = structuredClone(ANTENNAS);

for (let [ant, listCoords] of Object.entries(ANT_COORDS)) {
    // let ant = 'T';
    // let listCoords = ANT_COORDS['T']; // debug
    
    for (let i = 0; i < listCoords.length; i++) {
        for (let j = i; j < listCoords.length; j++) {
            let [x1, y1] = listCoords[i];
            let [x2, y2] = listCoords[j];
            
            const dx = x2 - x1;
            const dy = y2 - y1;

            if (dx == 0 && dy == 0) continue;

            mapAntinodes2[x1][y1] = '#';
            mapAntinodes2[x2][y2] = '#';
    
            x1 -= dx;
            y1 -= dy;

            x2 += dx;
            y2 += dy;

            while (!isOutOfBounds(x2, y2)) {
                // if (ANTENNAS[x2][y2] !== ant)
                    mapAntinodes2[x2][y2] = '#';

                x2 += dx;
                y2 += dy;
            }
            while (!isOutOfBounds(x1, y1)) {
                // if (ANTENNAS[x1][y1] !== ant)
                    mapAntinodes2[x1][y1] = '#';

                x1 -= dx;
                y1 -= dy;
            }
        }
    }
};


// console.log(mapAntinodes2.map(row => row.join('')).join('\n')); // Show map
let res2 = mapAntinodes2.map(row => row.join('')).join('\n').match(/#/g)?.length;
console.log(res2);

