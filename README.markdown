**permtuate( arr, n, callback )**


Generates permutations (no repetition) from an array.
Returns an array of arrays, each inner array being a permutation of arr

arr - required array of anything, or string

n - optional number of choices out of set arr, defaults to arr.length

callback - optional, defaults to:

`
function(err, result){
   if (err) return log(err); return log(result);
   };
`


**combinate( arr, n, callback )**
Same as permutate, but returns all possible combination, duplicate elements in arr are treated as unique


