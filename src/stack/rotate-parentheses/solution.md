# Problem Submission

- **problem_name**: rotate-parentheses
- **problem_description**: 대괄호, 중괄호, 소괄호로 이루어진 문자열 s가 매개변수로 주어진다 이 s 를 왼쪽으로 x 칸 만큼 회전시켰을 떄 s가 올바른 괄호 문자열이 되게 하는 x의 개수를 반환하는 solution() 함수를 완성하세요.
- **platform**: 프로그래머스 알고리즘 서적
- **data_structure**: 배열
- **used_algorithm**: 스택

- **idea_summary**: 괄호의 문제의 경우 대부분 stack 의 문제일 확률이 높음. flag 를 사용하여 불필요한 연산을 하지 않도록 방지
- **next_hint**: 나머지 연산자를 활용: (i+j) % s.length 로 인덱스 연산을 사용하여 논리적인 회전을 구현
