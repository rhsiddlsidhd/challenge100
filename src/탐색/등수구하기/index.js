function solution(arr) {
  let answer = "",
    n = arr.length;

  const sorted = arr.slice().sort((a, b) => b - a);

  for (let i = 0; i < n; i++) {
    answer += arr.indexOf(sorted[i]) + 1;
  }

  return answer;
}

let arr = [87, 89, 92, 100, 76];
console.log(solution(arr));
