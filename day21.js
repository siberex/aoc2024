// Day 21

import fs from 'node:fs/promises';

import AStar from './_astar.js';
import {printMap} from './_utils.js';

const DEBUG = false;
const input_filename = DEBUG ? './input/21.test' : './input/21.txt';
const INPUT = await fs.readFile(input_filename, { encoding: 'utf8' });


const MAP = INPUT.split('\n').map(row => row.split(''));

const MEMO = new Map();

const HEIGHT = MAP.length;
const WIDTH = MAP[0]?.length;
