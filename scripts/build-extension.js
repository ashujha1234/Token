
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building TOKUN Chrome Extension...');

// Run the Vite build
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}

// Ensure the dist/icons directory exists
const iconsDir = path.join(__dirname, '../dist/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log('Created icons directory');
}

// Copy icon files from public to dist
const iconSizes = [16, 48, 128];
iconSizes.forEach(size => {
  try {
    fs.copyFileSync(
      path.join(__dirname, `../public/icons/icon${size}.png`),
      path.join(__dirname, `../dist/icons/icon${size}.png`)
    );
    console.log(`✅ Copied icon${size}.png`);
  } catch (error) {
    console.error(`❌ Failed to copy icon${size}.png:`, error);
  }
});

// Copy manifest.json to dist
try {
  fs.copyFileSync(
    path.join(__dirname, '../public/manifest.json'),
    path.join(__dirname, '../dist/manifest.json')
  );
  console.log('✅ Copied manifest.json');
} catch (error) {
  console.error('❌ Failed to copy manifest.json:', error);
}

console.log('\nTOKUN Chrome Extension build complete!');
console.log('To load the extension in Chrome:');
console.log('1. Open Chrome and go to chrome://extensions/');
console.log('2. Enable "Developer mode" in the top-right corner');
console.log('3. Click "Load unpacked" and select the "dist" folder');
