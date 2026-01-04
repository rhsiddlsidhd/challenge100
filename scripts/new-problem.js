async function main() {
  // inquirer v9+ is ESM-only, so we use dynamic import()
  const inquirer = (await import("inquirer")).default;
  const fs = await import("fs");
  const path = await import("path");
  const { fileURLToPath } = await import("url");

  // In ES modules, __dirname is not available. We derive it from import.meta.url.
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const indexTemplate = `function solution(params) {
  var answer = 0;
  return answer;
}
`;

  const solutionMdTemplate = (problemName) =>
    `# Problem Submission

- **problem_name**: ${problemName}
- **problem_description**: <!-- 문제 설명을 여기에 작성하세요. -->
- **platform**: <!-- 문제 출처 (예: 프로그래머스, 백준, 코딩 테스트 서적)를 여기에 작성하세요. -->
- **data_structure**: <!-- 사용한 자료구조 (예: 배열, 스택, 큐)를 여기에 작성하세요. -->
- **used_algorithm**: <!-- 사용한 알고리즘 (예: 이중 for문, BFS, DFS, 정렬)을 여기에 작성하세요. -->

### idea_summary
<!-- 풀이의 핵심 아이디어와 문제에 접근한 방식을 요약하여 작성하세요.
    - 여러 줄로 작성 가능하며, Markdown 문법(예: 리스트, 인용구) 사용 가능합니다.
    - 예시: 각 수포자의 점수를 계산한 후, 가장 높은 점수를 받은 사람을 찾아 배열에 담아 반환했습니다.
-->

### next_hint
<!-- 문제 풀이 과정에서 고민했던 점이나, 다른 접근 방식에 대한 생각 등을 자유롭게 작성하세요.
    - 예시: 효율성을 더 높일 수 있는 방법이 있을지 고민했지만, 첫 접근으로는 현재 방식을 선택했습니다.
    - 예시: 특정 엣지 케이스(예: 빈 배열, 모든 원소가 동일한 경우) 처리 방식에 대한 고민
    - 예시: 다른 구현 방식(재귀, 해시맵)과의 장단점 비교
-->
`;

  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "category",
        message: "문제 카테고리를 입력하세요 (예: 탐색, 수학):",
        validate: function (value) {
          if (value.trim().length > 0) {
            return true;
          }
          return "카테고리를 입력해주세요.";
        },
      },
      {
        type: "input",
        name: "problemName",
        message: "문제명을 입력하세요 (예: 두 개 뽑아서 더하기):",
        validate: function (value) {
          if (value.trim().length > 0) {
            return true;
          }
          return "문제명을 입력해주세요.";
        },
      },
    ]);

    const { category, problemName } = answers;

    const sanitizedProblemName = problemName.replace(/\s+/g, "");
    const targetDir = path.join(
      __dirname,
      "..",
      "src",
      category,
      sanitizedProblemName
    );

    console.log(`\n'${targetDir}' 경로에 새 문제 폴더를 생성합니다...`);

    if (fs.existsSync(targetDir)) {
      console.error(
        `❌ 오류: 폴더가 이미 존재합니다. 다른 이름으로 시도해주세요.`
      );
      process.exit(1);
    }

    fs.mkdirSync(targetDir, { recursive: true });

    fs.writeFileSync(path.join(targetDir, "index.js"), indexTemplate);

    fs.writeFileSync(
      path.join(targetDir, "solution.md"),
      solutionMdTemplate(problemName)
    );

    console.log("✅ 성공적으로 다음 파일들을 생성했습니다:");
    console.log(`  - ${path.join(targetDir, "index.js")}`);
    console.log(`  - ${path.join(targetDir, "solution.md")}`);
    console.log("\n문제 풀이를 시작하세요! 화이팅! 💪");
  } catch (error) {
    if (error.isTtyError) {
      console.error(
        "❌ 오류: TTY 환경이 아니므로, 대화형 프롬프트를 실행할 수 없습니다."
      );
    } else {
      console.error("❌ 스크립트 실행 중 오류가 발생했습니다:", error);
    }
    process.exit(1);
  }
}

main();
