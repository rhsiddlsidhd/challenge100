function solution(s) {
  var result = 0,
    n = s.length;

  for (let i = 0; i < n; i++) {
    let stack = [],
      flag = false;
    for (let j = 0; j < n; j++) {
      // 첫번째 값을 마지막으로 넘겨주고 나머지는 push
      // 단, 첫번쨰 값이 { (  [ 일 경우는 X
      const c = s[(i + j) % n];

      if (c === "[" || c === "{" || c === "(") {
        stack.push(c);
      } else {
        if (stack.length === 0) {
          flag = true;
          break;
        }
        const top = stack[stack.length - 1];
        if (c === "]" && top === "[") {
          stack.pop();
        } else if (c === "}" && top === "{") {
          stack.pop();
        } else if (c === ")" && top === "(") {
          stack.pop();
        } else {
          flag = true;
          break;
        }
      }
    }

    if (stack.length === 0 && !flag) {
      result += 1;
    }
  }

  return result;
}

const s = "[](){}";
console.log(solution(s));
