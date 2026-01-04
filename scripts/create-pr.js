const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

async function main() {
  try {
    console.log("PR 생성을 시작합니다.");

    // 1. Staged 파일 확인
    console.log("1. 스테이징된 파일 목록을 확인합니다...");
    const stagedFiles = getStagedFiles();

    const jsFile = stagedFiles.find((file) => file.endsWith("index.js"));
    const mdFile = stagedFiles.find((file) => file.endsWith("solution.md"));

    if (!jsFile || !mdFile) {
      throw new Error(
        `스테이징된 파일 중 'index.js' 또는 'solution.md' 파일을 찾을 수 없습니다. 다음 파일들이 스테이징되었습니다: ${stagedFiles.join(
          ", "
        )}`
      );
    }
    console.log(`  - 대상 JS 파일: ${jsFile}`);
    console.log(`  - 대상 MD 파일: ${mdFile}`);

    // 2. PR 제목 생성
    console.log("2. PR 제목을 생성합니다...");
    const prInfo = createPrTitle(mdFile);
    console.log(`  - 생성된 PR 제목: ${prInfo.fullTitle}`);

    // 3. PR 본문 구성
    console.log("3. PR 본문을 구성합니다...");
    const body = createPrBody(jsFile, mdFile, prInfo);
    console.log("  - PR 본문이 성공적으로 생성되었습니다.");

    // 4. PR 생성 실행
    console.log("4. GitHub PR 생성을 시도합니다...");
    // 제목에 포함될 수 있는 큰따옴표를 이스케이프 처리합니다.
    const escapedTitle = prInfo.fullTitle.replace(/"/g, '\\"');
    const command = `gh pr create --base master --title "${escapedTitle}" --body-file - --web`;

    console.log("  - PR 생성 명령어를 실행합니다.");
    execSync(command, {
      input: body, // PR 본문을 stdin으로 전달
      stdio: "inherit", // gh 명령어의 출력을 실시간으로 보여주기 위함
    });

    console.log("✅ PR 생성 스크립트 실행이 완료되었습니다.");
  } catch (error) {
    console.error("❌ 스크립트 실행 중 오류가 발생했습니다:", error.message);
    process.exit(1);
  }
}

function getStagedFiles() {
  const output = execSync(
    "git -c core.quotepath=false diff --staged --name-only"
  )
    .toString()
    .trim();
  if (!output) {
    throw new Error(
      "스테이징된 파일이 없습니다. `git add`로 파일을 추가해주세요."
    );
  }
  return output.split("\n");
}

function createPrTitle(mdFilePath) {
  const mdContent = fs.readFileSync(mdFilePath, "utf8");

  // 정규표현식: '- **problem_name**:' 뒤의 내용을 그룹(1)으로 캡처
  const match = mdContent.match(/-\s*\*\*problem_name\*\*:\s*(.*)/i);

  // 1. 항목 자체가 없는 경우
  if (!match) {
    throw new Error(
      "❌ 'solution.md'에 '- **problem_name**:' 항목이 아예 없습니다."
    );
  }

  // 2. 항목은 있는데 값이 비어있는 경우 (예: "- **problem_name**: ")
  const problemName = match[1].trim();

  if (problemName === "") {
    throw new Error(
      "❌ 'solution.md'의 'problem_name' 값이 비어있습니다. 문제 이름을 입력해주세요."
    );
  }

  // 1. '- **used_algorithm**' 뒤의 내용을 찾거나, 아랫줄의 인용구(>) 내용을 찾음
  const algorithmMatch = mdContent.match(
    /-\s*\*\*used_algorithm\*\*\s*(?:\n>\s*)?(.*)/i
  );

  if (
    !algorithmMatch ||
    !algorithmMatch[1] ||
    algorithmMatch[1].trim() === ""
  ) {
    throw new Error(
      `'${mdFilePath}'에서 'used_algorithm' 항목의 내용을 찾을 수 없습니다. (예: - **used_algorithm** > 이중 for문)`
    );
  }

  const algorithm = algorithmMatch[1].trim();

  return {
    fullTitle: `feat(${algorithm}): ${problemName} 풀이`,
    problemName,
    algorithm,
  };
}

function fillPrBodyField(templateContent, mdContent, mdKey, templateKey) {
  const regex = new RegExp(`- \\*\\*${mdKey}\\*\\*:\\s*(.*)`, "i");
  const match = mdContent.match(regex);

  if (match && match[1] && match[1].trim() !== "") {
    const value = match[1].trim();
    return templateContent.replace(
      new RegExp(`- \\*\\*${templateKey}\\*\\*:\\s*`),
      `- **${templateKey}**: ${value}`
    );
  } else {
    console.warn(
      `⚠️ 'solution.md'에서 '${mdKey}'를 찾지 못해 PR 템플릿의 '${templateKey}' 항목이 비어있습니다.`
    );
    return templateContent;
  }
}

function fillPrBodySection(
  templateContent,
  mdContent,
  mdHeading,
  templateHeading
) {
  const regex = new RegExp(
    `### ${mdHeading}\\s*:?\\s*([\\s\\S]*?)(?=\\r?\\n###|\\Z)`
  );
  const match = mdContent.match(regex);

  if (match && match[1] && match[1].trim() !== "") {
    const value = match[1].trim();
    return templateContent.replace(
      templateHeading,
      `${templateHeading}\n\n${value}`
    );
  } else {
    console.warn(
      `⚠️ 'solution.md'에서 '${mdHeading}' 섹션을 찾지 못해 PR 템플릿의 관련 항목이 비어있습니다.`
    );
    return templateContent;
  }
}

function createPrBody(jsFilePath, mdFilePath, prInfo) {
  const templatePath = ".github/PULL_REQUEST_TEMPLATE.md";
  let templateContent = fs.readFileSync(templatePath, "utf8");
  const mdContent = fs.readFileSync(mdFilePath, "utf8");

  // '문제 정보' 섹션 자동 채우기
  templateContent = templateContent.replace(
    "- **문제명**:",
    `- **문제명**: ${prInfo.problemName}`
  );
  templateContent = templateContent.replace(
    "- **알고리즘**:",
    `- **알고리즘**: ${prInfo.algorithm}`
  );

  // solution.md 내용을 기반으로 PR 템플릿의 나머지 항목 채우기
  templateContent = fillPrBodyField(
    templateContent,
    mdContent,
    "problem_description",
    "문제설명"
  );
  templateContent = fillPrBodyField(
    templateContent,
    mdContent,
    "platform",
    "플랫폼"
  );
  templateContent = fillPrBodyField(
    templateContent,
    mdContent,
    "data_structure",
    "자료구조"
  );

  templateContent = fillPrBodySection(
    templateContent,
    mdContent,
    "idea_summary",
    "## 💡 풀이 요약"
  );
  templateContent = fillPrBodySection(
    templateContent,
    mdContent,
    "next_hint",
    "## 🤔 고민한 점"
  );

  return templateContent;
}

main();
