const fs = require('fs');
const path = require('path');
const glob = require('glob');

const SCRIPT_TAG = '<script src="/dashboard-console-capture.js"></script>';
const COMMENT = '<!-- Console capture script for dashboard debugging -->';

// Find all HTML files in the build output
const buildDir = path.join(process.cwd(), 'out');
const htmlFiles = glob.sync('**/*.html', { cwd: buildDir, absolute: true });

console.log(`Found ${htmlFiles.length} HTML files to process...`);

htmlFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if script is already injected
    if (content.includes('dashboard-console-capture.js')) {
      return;
    }
    
    // Inject script tag right after <head> opening tag
    content = content.replace(
      '<head>',
      `<head>\n    ${COMMENT}\n    ${SCRIPT_TAG}`
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✓ Injected console capture script into ${path.relative(buildDir, filePath)}`);
  } catch (error) {
    console.error(`✗ Failed to process ${filePath}:`, error.message);
  }
});

console.log('Console capture script injection completed.');