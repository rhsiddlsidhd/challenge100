# Problem Submission

- **problem_name**: 모의고사
- **problem_description**: 수포자 삼인방은 모의고사에 수학 문제를 전부 찍으려고 합니다. 수포자들의 찍는 방식이 patterns 로 제공되며 1번부터 마지막 문제까지의 정답이 순서대로 저장된 배열 answers기 주어졌을 때 가장 많은 문제를 맞힌 사람이 누구인지 배열에 담아 반환하도록 solution() 함수를 작성하세요.
- **platform**:프로그래머스 알고리즘 서적
- **data_structure**: 배열
- **used_algorithm**: 완전 탐색

### idea_summary :

- 문제의 length 만큼 반복 그리고 학생들의 정답과 매칭하여 score 누적 계산 및 Math.max 를 통해 최고 점수 filter

### next_hint :

- 수포자의 패턴 길이보다 정답지의 패턴 길이가 더 길 경우에 초과되는 정답의 경우 수포자의 답 패턴 첫 번쨰부터 다시 매치하기 위해 나머지 연산자 사용
