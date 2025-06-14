// filepath: /Users/fsato/works/SmallStacks/scripts/generate-types.js
import { exec } from "child_process";
import dotenv from "dotenv";

// .envファイルを読み込む
dotenv.config();

// 環境変数からプロジェクトIDを取得
const projectId = process.env.SUPABASE_PROJECT_ID;

if (!projectId) {
  console.error("Error: SUPABASE_PROJECT_ID is not defined in .env file.");
  process.exit(1);
}

// Supabaseの型生成コマンドを実行
const command = `supabase gen types typescript --project-id ${projectId} > src/types/supabase.ts`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
