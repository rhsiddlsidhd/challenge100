const solution = (arr) => {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      result.push(arr[i] + arr[j]);
    }
  }

  return [...new Set(result)].sort((a, b) => a - b);
};

console.log(solution([2, 1, 3, 4, 1]));
