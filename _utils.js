
// returns least-significant bits first
// 77 → [ 5, 1, 1 ]
// 173440400472902 → [ 6, 0, 5, 5, 3, 3, 5, 3, 5, 7, 0, 7, 3, 3, 7, 4 ]
export const splitNumber3BitMask = n => {
    let bigN = BigInt(n);
    let res = [];
    while (bigN !== 0n) {
        res.push(bigN & 7n);
        bigN >>= 3n;
    }
    return res.map(Number);
}

// [ 5, 1, 1 ] → 77
// [ 6, 0, 5, 5, 3, 3, 5, 3, 5, 7, 0, 7, 3, 3, 7, 4 ] → 173440400472902
export const combineNumberFrom3BitMasks = arr => {
    // JS have 32-bit bitwise arithmetic,
    // So BigInt have to be used for any arr.length > 10

    const res = arr.map((digit, i) => BigInt(digit) << (BigInt(i) * 3n)).reduce((acc, num) => acc | num, 0n);

    // If produced number is less than Number.MAX_SAFE_INTEGER (2**53-1) then it is safe to convert it to Number.
    return Number(res);
}
