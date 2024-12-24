// Day 23

import fs from 'node:fs/promises';

import WeightedGraph from './_dijkstra.js';

const DEBUG = true;
const input_filename = DEBUG ? './input/23.test' : './input/23.txt';
const INPUT = await fs.readFile(input_filename, { encoding: 'utf8' });

const DATA = INPUT.split('\n').filter(v => v).map(
    row => row.split('-')
);

// console.log(DATA);

// Name starts with t
// const ROOTS = [];

const NODES = new Map();

var graph = new WeightedGraph();

DATA.forEach(tuple => {
    const [A, B] = tuple;

    if (NODES.has(A)) {
        NODES.get(A).push(B);
    } else {
        NODES.set(A, [B]);
    }

    // Connections aren't directional: kh-tc = tc-kh
    if (NODES.has(B)) {
        NODES.get(B).push(A);
    } else {
        NODES.set(B, [A]);
    }

    // just for fun
    graph.addVertex(A);
    graph.addVertex(B);
    graph.addEdge(A, B, 1);
    graph.addEdge(B, A, 1);
});


/*
NODES = Map(16) {
  'kh' => [ 'tc', 'qp', 'ub', 'ta' ],
  'tc' => [ 'kh', 'wh', 'td', 'co' ],
  'qp' => [ 'kh', 'ub', 'td', 'wh' ],
  'de' => [ 'cg', 'co', 'ta', 'ka' ],
  'cg' => [ 'de', 'tb', 'yn', 'aq' ],
  'ka' => [ 'co', 'tb', 'ta', 'de' ],
  'co' => [ 'ka', 'ta', 'de', 'tc' ],
  'yn' => [ 'aq', 'cg', 'wh', 'td' ],
  'aq' => [ 'yn', 'vc', 'cg', 'wq' ],
  'ub' => [ 'qp', 'kh', 'wq', 'vc' ],
  'tb' => [ 'cg', 'ka', 'wq', 'vc' ],
  'vc' => [ 'aq', 'ub', 'wq', 'tb' ],
  'wh' => [ 'tc', 'td', 'yn', 'qp' ],
  'ta' => [ 'co', 'ka', 'de', 'kh' ],
  'td' => [ 'tc', 'wh', 'qp', 'yn' ],
  'wq' => [ 'tb', 'ub', 'aq', 'vc' ]
}
*/


const connections = new Map();

NODES.forEach((_, name) => {
    //let countConnections = 0;

    const nameConnections = {};

    NODES.forEach((names, iterName) => {
        if (name === iterName) return;
        // if (names.includes(name)) countConnections++;

        // const nameConnections = names.map(nameTo => ({[nameTo]: graph.Dijkstra(name, nameTo).length}));

        // connections.set(name, nameConnections);

        nameConnections[iterName] = graph.Dijkstra(name, iterName).length;
    });

    connections.set(name, nameConnections);
    // console.log(name, countConnections);

});

console.log(connections);



process.exit();


// console.log(graph.Dijkstra("zz", "ww")); — WRONG result!
// console.log(graph.Dijkstra("kh", "de")); // length >= 2 = OK

/*
const KEYS = new Set([...NODES.keys()].sort());
console.log(KEYS);

const VALUES = [...NODES.values()].map(computers => {
    return new Set(computers.toSorted());
});
console.log(VALUES);
*/

const keys = [...NODES.keys()];
let maxDist = 0;

for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
        const dist = graph.Dijkstra(keys[i], keys[j]).length;
        if (dist > maxDist) maxDist = dist;
    }
}
// console.log(maxDist);
console.log(keys);

const connected = keys.filter(A => {
    
    let connections = 0;
    for (let i = 0; i < keys.length; i++) {
        const B = keys[i];
        if (A === B) continue;

        const path = graph.Dijkstra(A, B);
        const dist = path.length;
        // if (dist != 0) return false;

        // console.log(A, B, path, dist);
        // if (dist >= 2) return true;
        if (dist >= 2) connections++;

    }

    return connections === (keys.length - 1);
});

console.log(connected);


/*
const found = new Set();
for (let i = 0; i < keys.length; i++) {
    const A = keys[i];
    
    const connected = keys.filter(B => {
        return maxDist === graph.Dijkstra(A, B).length;
    })

    if (connected.length === maxDist) {
        console.log(`${A}`);
    }
    
    // for (let j = i + 1; j + 1 < keys.length; j++) {
    //     const dist1 = graph.Dijkstra(keys[i], keys[j]).length;
    //     const dist2 = graph.Dijkstra(keys[j], keys[i]).length;
    //     const tuple = [ keys[i], keys[j] ].sort();
    //     if (dist1 === dist2 && dist1 === 2) found.add(tuple.join('-'));
    // }
    
}

console.log(found);
*/


// Part 1:

/*
NODES = Map(16) {
  'kh' => [ 'tc', 'qp', 'ub', 'ta' ],
  'tc' => [ 'kh', 'wh', 'td', 'co' ],
  'qp' => [ 'kh', 'ub', 'td', 'wh' ],
  'de' => [ 'cg', 'co', 'ta', 'ka' ],
  'cg' => [ 'de', 'tb', 'yn', 'aq' ],
  'ka' => [ 'co', 'tb', 'ta', 'de' ],
  'co' => [ 'ka', 'ta', 'de', 'tc' ],
  'yn' => [ 'aq', 'cg', 'wh', 'td' ],
  'aq' => [ 'yn', 'vc', 'cg', 'wq' ],
  'ub' => [ 'qp', 'kh', 'wq', 'vc' ],
  'tb' => [ 'cg', 'ka', 'wq', 'vc' ],
  'vc' => [ 'aq', 'ub', 'wq', 'tb' ],
  'wh' => [ 'tc', 'td', 'yn', 'qp' ],
  'ta' => [ 'co', 'ka', 'de', 'kh' ],
  'td' => [ 'tc', 'wh', 'qp', 'yn' ],
  'wq' => [ 'tb', 'ub', 'aq', 'vc' ]
}

R1
qp → [ 'kh', 'ub', 'td', 'wh' ]
    R2
    kh → [ 'tc', 'qp', 'ub', 'ta' ]
        R3
        tc × [ 'kh', 'wh', 'td', 'co' ] (no qp)
        qp × (loopback)
        ub ✓ [ 'qp', 'kh', 'wq', 'vc' ] → qp, kh, ub
        ta × [ 'co', 'ka', 'de', 'kh' ] (no qp)
    ub → [ 'qp', 'kh', 'wq', 'vc' ]
        qp ×
        kh ✓ [ 'tc', 'qp', 'ub', 'ta' ] → qp, ub, kh
        wq × [ 'tb', 'ub', 'aq', 'vc' ]
        vc × [ 'aq', 'ub', 'wq', 'tb' ]
    td → [ 'tc', 'wh', 'qp', 'yn' ]
        tc × [ 'kh', 'wh', 'td', 'co' ]
        wh ✓ [ 'tc', 'td', 'yn', 'qp' ] → qp, td, wh
        qp ×
        yn × [ 'aq', 'cg', 'wh', 'td' ]
    wh → [ 'tc', 'td', 'yn', 'qp' ]
        tc × [ 'kh', 'wh', 'td', 'co' ]
        td ✓ [ 'tc', 'wh', 'qp', 'yn' ] → qp, wh, td
        yn × [ 'aq', 'cg', 'wh', 'td' ]
        qp ×
*/


process.exit();


let triplets = new Set();

NODES.forEach((leafs1, root1) => {

    leafs1 = leafs1.filter(root2 => {
        let leafs2 = NODES.get(root2);

        leafs2 = leafs2.filter(root3 => {
            if (root3 === root1) return false; // loopback
            
            let leafs3 = NODES.get(root3);
            if (leafs3.includes(root1)) {
                triplets.add([root1, root2, root3].sort().join('_'));
                return true;
            }

            return false;
        });

        return leafs2.length > 0;
    });

});



// console.log(triplets);

const re = /t.{1}/g;
// re.test(triplet) → somehow filters too much, no diea

const filtered = [...triplets.values()].filter(triplet => triplet.split('_').some(name => name.at(0) === 't'));
// console.log(filtered.sort());

// 2456 — answer is too high
// 1314 ✓

console.log(filtered.length);

