const { execSync } = require('child_process');
const fs = require('fs');

console.log('Testing Git Repository Setup...\n');

// Test 1: Check if .git directory exists
console.log('1. Checking if .git directory exists...');
if (fs.existsSync('.git')) {
  console.log('✅ .git directory exists');
} else {
  console.log('❌ .git directory not found');
  process.exit(1);
}

// Test 2: Check git user configuration
console.log('\n2. Checking git user configuration...');
try {
  const userName = execSync('git config user.name', { encoding: 'utf8' }).trim();
  const userEmail = execSync('git config user.email', { encoding: 'utf8' }).trim();
  
  if (userName && userEmail) {
    console.log(`✅ Git user configured: ${userName} <${userEmail}>`);
  } else {
    console.log('❌ Git user not configured');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ Error checking git configuration:', error.message);
  process.exit(1);
}

// Test 3: Check remote origin
console.log('\n3. Checking remote origin...');
try {
  const remotes = execSync('git remote -v', { encoding: 'utf8' });
  if (remotes.includes('origin') && remotes.includes('github.com')) {
    console.log('✅ Remote origin configured');
  } else {
    console.log('❌ Remote origin not configured properly');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ Error checking remote origin:', error.message);
  process.exit(1);
}

// Test 4: Check initial commit
console.log('\n4. Checking initial commit...');
try {
  const log = execSync('git log --oneline', { encoding: 'utf8' });
  const commits = log.split('\n').filter(line => line.trim());
  if (commits.length > 0) {
    console.log(`✅ Found ${commits.length} commit(s)`);
    console.log(`   Latest: ${commits[0]}`);
  } else {
    console.log('❌ No commits found');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ Error checking commits:', error.message);
  process.exit(1);
}

// Test 5: Check current branch
console.log('\n5. Checking current branch...');
try {
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  if (currentBranch === 'main') {
    console.log('✅ On main branch');
  } else {
    console.log(`⚠️  On branch: ${currentBranch} (expected main)`);
  }
} catch (error) {
  console.log('❌ Error checking current branch:', error.message);
  process.exit(1);
}

// Test 6: Check .gitignore
console.log('\n6. Checking .gitignore...');
if (fs.existsSync('.gitignore')) {
  const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
  const requiredEntries = ['node_modules', '.env.local', '.next'];
  const missingEntries = requiredEntries.filter(entry => !gitignoreContent.includes(entry));
  
  if (missingEntries.length === 0) {
    console.log('✅ .gitignore properly configured');
  } else {
    console.log(`⚠️  .gitignore missing entries: ${missingEntries.join(', ')}`);
  }
} else {
  console.log('❌ .gitignore not found');
  process.exit(1);
}

console.log('\n🎉 All git repository tests passed!');

