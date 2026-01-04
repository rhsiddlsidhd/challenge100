function solution(arr) {
  let answer = 0,
    n = arr.length,
    dx = [0, 1, 0, -1],
    dy = [-1, 0, 1, 0];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let flag = 1;
      for (let k = 0; k < dx.length; k++) {
        let my = i + dy[k];
        let mx = j + dx[k];

        if (
          my >= 0 &&
          my < n &&
          mx >= 0 &&
          mx < n &&
          arr[i][j] <= arr[my][mx]
        ) {
          flag = 0;
          break;
        }
      }
      if (flag) answer++;
    }
  }

  return answer;
}

let arr = [
  [5, 3, 7, 2, 3],
  [3, 7, 1, 6, 1],
  [7, 2, 5, 3, 4],
  [4, 3, 6, 4, 1],
  [8, 7, 3, 5, 2],
];
console.log(solution(arr));
