const solution = (a, b, c) => {
  let max = Math.max(a, b, c),
    total = a + b + c;

  return max < total - max ? "YES" : "NO";
};

console.log(solution(13, 33, 17));
