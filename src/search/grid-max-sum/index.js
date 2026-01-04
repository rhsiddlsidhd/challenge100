function solution(arr) {
  let answer = Number.MIN_SAFE_INTEGER;

  for (let i = 0; i < arr.length; i++) {
    let rows = 0,
      cols = 0;
    for (let j = 0; j < arr[i].length; j++) {
      rows += arr[i][j];
      cols += arr[j][i];
    }
    answer = Math.max(answer, rows, cols);
  }
  let dia = 0,
    rdia = 0;
  for (let i = 0; i < arr.length; i++) {
    dia += arr[i][i];
    rdia += arr[i][arr.length - 1 - i];
  }
  answer = Math.max(dia, rdia, answer);

  return answer;
}

let arr = [
  [10, 13, 10, 12, 15],
  [12, 39, 30, 23, 11],
  [11, 25, 50, 53, 15],
  [19, 27, 29, 37, 27],
  [19, 13, 30, 13, 19],
];
console.log(solution(arr));
