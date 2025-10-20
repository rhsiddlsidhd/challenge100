const arr = [1, 2, 3, 4, 8];

const target = 6;

// 계수정렬

const countSort = (arr, k) => {
  const hashtable = new Array(k + 1).fill(0);

  for (const num of arr) {
    if (num <= k) {
      hashtable[num] += 1;
    }
  }
  return hashtable;
};

function solution(arr, target) {
  const hashtable = countSort(arr, target);

  for (const num of arr) {
    const complement = target - num;
    if (
      complement >= 0 &&
      hashtable[complement] === 1 &&
      complement <= target &&
      complement !== num
    ) {
      return true;
    }
  }

  return false;
}

console.log(solution(arr, target));
