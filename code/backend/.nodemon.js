import prettier from "prettier";
import nodemon from "nodemon";
import fs from "fs";

const args = process.argv.slice(2).join(" ");
nodemon({
  ext: "ts",
  execMap: {
    ts: args ? args : "ts-node",
  },
  script: "./src/server.ts",
  ignore: [".git", "node_modules/**/node_modules", ".turbo"],
  watch: ["src"],
}).on("restart", (files) => {
  files.map((f) => {
    const text = fs.readFileSync(f, "utf8");
    try {
      const formattedCode = prettier.format(text, { filepath: f });
      if (!!formattedCode && formattedCode !== text) {
        fs.writeFileSync(f, formattedCode);
      }
    } catch (e) {
      if (!e instanceof SyntaxError)
        console.error(e);
    }
  });
});
