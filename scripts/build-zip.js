import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const zipFile = path.resolve(rootDir, 'stamp-maker.zip');

console.log('🚀 开始构建并打包小工具 ZIP...');

// 1. Build
console.log('📦 正在执行 tsc & vite build...');
execSync('pnpm run build', { cwd: rootDir, stdio: 'inherit' });

// 2. Remove old zip if exists
if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
}

// 3. Zip dist contents
console.log('🗜️  正在打包 dist 目录内容为 stamp-maker.zip...');
try {
  execSync(`cd "${distDir}" && zip -r "${zipFile}" . -x '*.DS_Store'`, {
    stdio: 'inherit',
  });
  const stats = fs.statSync(zipFile);
  const sizeKb = (stats.size / 1024).toFixed(1);
  console.log(`\n✨ 打包成功！产物路径: ${zipFile} (${sizeKb} KB)`);
} catch (err) {
  console.error('❌ 打包失败:', err);
  process.exit(1);
}
