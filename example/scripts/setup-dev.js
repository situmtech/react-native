const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the parent directory path where the Situm plugin is located
const parentDir = path.resolve(__dirname, '..');
const pluginDir = path.resolve(parentDir, '..'); // Plugin is directly in the parent directory

// Function to check if the plugin directory exists and contains necessary files
function checkPluginDirectory() {
  if (!fs.existsSync(path.join(pluginDir, 'package.json'))) {
    console.error('Error: Situm plugin package.json not found in parent directory');
    process.exit(1);
  }
}

// Function to setup development environment
async function setupDev() {
  try {
    checkPluginDirectory();
    
    // Install plugin dependencies
    console.log('Installing plugin dependencies...');
    execSync('yarn install', { cwd: pluginDir, stdio: 'inherit' });
    
    // Create symlink for the plugin
    console.log('Creating symlink for the plugin...');
    execSync('yarn link', { cwd: pluginDir, stdio: 'inherit' });
    execSync('yarn link "@situm/react-native"', { cwd: process.cwd(), stdio: 'inherit' });
    
    console.log('Development environment setup completed successfully!');
  } catch (error) {
    console.error('Error setting up development environment:', error);
    process.exit(1);
  }
}

setupDev(); 