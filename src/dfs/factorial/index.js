const solution = (value) => {
  let answer;

  const DFS = (L) => {
    if (L <= 1) return 1;
    else {
      return L * DFS(L - 1);
    }
  };

  answer = DFS(value);
  return answer;
};

console.log(solution(5));
