import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';

test.describe('Git Repository Tests', () => {
  test('git repository is initialized', () => {
    // Check if .git directory exists
    const fs = require('fs');
    expect(fs.existsSync('.git'), '.git directory should exist').toBe(true);
  });

  test('git configuration is set up', () => {
    // Check git user configuration
    const userName = execSync('git config user.name', { encoding: 'utf8' }).trim();
    const userEmail = execSync('git config user.email', { encoding: 'utf8' }).trim();
    
    expect(userName).toBeTruthy();
    expect(userEmail).toBeTruthy();
    expect(userEmail).toContain('@');
  });

  test('remote origin is configured', () => {
    // Check if remote origin exists
    const remotes = execSync('git remote -v', { encoding: 'utf8' });
    expect(remotes).toContain('origin');
    expect(remotes).toContain('github.com');
  });

  test('initial commit exists', () => {
    // Check if there's at least one commit
    const log = execSync('git log --oneline', { encoding: 'utf8' });
    expect(log).toBeTruthy();
    expect(log.split('\n').length).toBeGreaterThan(0);
  });

  test('main branch exists', () => {
    // Check current branch
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    expect(currentBranch).toBe('main');
  });

  test('gitignore is properly configured', () => {
    // Check if .gitignore exists and contains important entries
    const fs = require('fs');
    expect(fs.existsSync('.gitignore'), '.gitignore should exist').toBe(true);
    
    const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
    expect(gitignoreContent).toContain('node_modules');
    expect(gitignoreContent).toContain('.env.local');
    expect(gitignoreContent).toContain('.next');
  });
});

