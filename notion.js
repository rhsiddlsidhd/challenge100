const fs = require("fs");
const https = require("https");
console.log("hi");
const data = JSON.parse(fs.readFileSync("output.json", "utf8"));

const body = {
  parent: { database_id: process.env.NOTION_DB_ID },
  properties: {
    문제명: {
      title: [{ text: { content: data.problem_name } }],
    },
    플랫폼: {
      select: { name: data.platform },
    },
    난이도: {
      select: { name: data.difficulty },
    },
    자료구조: {
      select: { name: data.data_structure },
    },
    알고리즘: {
      multi_select: data.used_algorithm.map((a) => ({ name: a })),
    },
    사고요약: {
      rich_text: [{ text: { content: data.idea_summary } }],
    },
    시간복잡도: {
      rich_text: [{ text: { content: data.time_complexity } }],
    },
    공간복잡도: {
      rich_text: [{ text: { content: data.space_complexity } }],
    },
    피드백: {
      rich_text: [{ text: { content: data.feedback.join("\n") } }],
    },
    개선힌트: {
      rich_text: [{ text: { content: data.next_hint } }],
    },
    점수: {
      number: data.score,
    },
    해결일: {
      date: { start: data.created_at },
    },
  },
};

const payload = JSON.stringify(body);

const req = https.request(
  {
    hostname: "api.notion.com",
    path: "/v1/pages",
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
      "Content-Length": Buffer.byteLength(payload),
    },
  },
  (res) => {
    let result = "";
    res.on("data", (c) => (result += c));
    res.on("end", () => {
      console.log("Status:", res.statusCode);
      if (res.statusCode < 200 || res.statusCode >= 300) {
        console.error(result);
        process.exit(1);
      }
    });
  }
);

req.on("error", (err) => {
  console.error(err);
  process.exit(1);
});

req.write(payload);
req.end();
