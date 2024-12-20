
// Note: the most-significant bits came first
// 77 → [1, 1, 5]
// 173440400472902 → [4, 7, 3, 3, 7, 0, 7, 5, 3, 5, 3, 3, 5, 5, 0, 6]
// 16316994351714 → [3, 5, 5, 3, 4, 3, 0, 5, 1, 5, 7, 1, 1, 4, 2]
// 88645122800472 → [2, 4, 1, 1, 7, 5, 1, 5, 0, 3, 4, 3, 5, 5, 3, 0]
export const splitNumber3BitMask = n => {
    let bigN = BigInt(n);
    let res = [];
    while (bigN !== 0n) {
        res.push(bigN % 8n);
        bigN /= 8n;
        // res.push(bigN & 7n); // aka bigN % 8n
        // bigN >>= 3n; // aka bigN /= 8n
    }
    return res.toReversed().map(Number);
}

// Input expected to be filled most-significant bits to least-significant
// [1, 1, 5] → 77
// [4, 7, 3, 3, 7, 0, 7, 5, 3, 5, 3, 3, 5, 5, 0, 6] → 173440400472902
// [3, 5, 5, 3, 4, 3, 0, 5, 1, 5, 7, 1, 1, 4, 2] → 16316994351714
// [2, 4, 1, 1, 7, 5, 1, 5, 0, 3, 4, 3, 5, 5, 3, 0] → 88645122800472
export const combineNumberFrom3BitMasks = arr => {
    // JS have 32-bit bitwise arithmetic,
    // So BigInt have to be used for any arr.length > 10

    // let res = 0n;
    // for (let i = 0; i < arr.length; i++) {
    //     res |= BigInt(arr[i]) << (BigInt(arr.length - i - 1) * 3n);
    // }

    const res = arr
        .map( (digit, i) => BigInt(digit) << (BigInt(arr.length - i - 1) * 3n) )
        .reduce( (acc, num) => acc | num, 0n );

    // If produced number is less than Number.MAX_SAFE_INTEGER (2**53-1) then it is safe to convert it to Number.
    return Number(res);
}

// https://stackoverflow.com/a/37580979/1412330
export const permute = permutation => {
    let length = permutation.length,
        result = [permutation.slice()],
        c = Array(length).fill(0),
        i = 1, k, p;

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = permutation[i];
            permutation[i] = permutation[k];
            permutation[k] = p;
            ++c[i];
            i = 1;
            result.push(permutation.slice());
        } else {
            c[i] = 0;
            ++i;
        }
    }
    return result;
}

/*
export const permutator = (inputArr) => {
    let result = [];
  
    const permute = (arr, m = []) => {
      if (arr.length === 0) {
        result.push(m)
      } else {
        for (let i = 0; i < arr.length; i++) {
          let curr = arr.slice();
          let next = curr.splice(i, 1);
          permute(curr.slice(), m.concat(next))
       }
     }
   }
  
   permute(inputArr)
  
   return result;
}
*/


// Number permutations
export function generatePermutations(n, base, toInt) {
    if (!base) base = 2;
    const digit = (base - 1).toString();
  
    // Max integer of the requested base of the length = n
    var maxN = parseInt(digit.repeat(n), base);
  
    const states = [];
    // For every int between 0 and max integer of that base
    for (let i = 0; i <= maxN; i++) {
        // Convert to binary, pad with 0, and push to the result
        const state = i.toString(base).padStart(n, '0').split('');
        states.push( toInt ? state.map(Number) : state );
    }
  
    return states;
}


function findAllCombinationsToFillStr(patterns, string) {

}
