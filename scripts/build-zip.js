import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const pkgPath = path.resolve(rootDir, 'package.json');

// Read package.json
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

// Determine version: CLI arg (e.g. pnpm run zip 1.0.1) or package.json version
const customVersionArg = process.argv.slice(2).find((arg) => !arg.startsWith('-'));
const version = customVersionArg || pkg.version || '1.0.0';
const baseName = pkg.name || 'stamp-maker';
const zipFileName = `${baseName}-${version}.zip`;
const zipFile = path.resolve(rootDir, zipFileName);

console.log(`🚀 开始构建并打包小工具 ZIP [${zipFileName}]...`);

// 1. Build
console.log('📦 正在执行 tsc & vite build...');
execSync('pnpm run build', { cwd: rootDir, stdio: 'inherit' });

// 2. Remove old version zip if exists
if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
}

// 3. Zip dist contents
console.log(`🗜️  正在打包 dist 目录内容为 ${zipFileName}...`);
try {
  execSync(`cd "${distDir}" && zip -r "${zipFile}" . -x '*.DS_Store'`, {
    stdio: 'inherit',
  });
  const stats = fs.statSync(zipFile);
  const sizeKb = (stats.size / 1024).toFixed(1);
  console.log(`\n✨ 打包成功！`);
  console.log(`📦 产物路径: ${zipFile}`);
  console.log(`📊 包体积: ${sizeKb} KB (Version: ${version})\n`);
} catch (err) {
  console.error('❌ 打包失败:', err);
  process.exit(1);
}
