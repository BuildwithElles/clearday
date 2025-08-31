import { test, expect } from '@playwright/test';
import { 
  BasePage, 
  AuthHelpers, 
  FormHelpers, 
  NavigationHelpers, 
  DataHelpers, 
  AssertionHelpers, 
  PerformanceHelpers, 
  AccessibilityHelpers,
  waitForTimeout,
  retry,
  createTestId,
  createAriaLabel,
  createTextSelector
} from './helpers';
import { 
  testUsers, 
  testTasks, 
  testEvents, 
  createTestUser, 
  createTestTask, 
  createTestEvent,
  testScenarios 
} from '../fixtures/data';

// Test implementation of BasePage
class TestPage extends BasePage {
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getElementText(selector: string): Promise<string> {
    return await this.getText(selector);
  }
}

test.describe('Test Utilities', () => {
  test.describe('BasePage', () => {
    test('BasePage can navigate to pages', async ({ page }) => {
      const testPage = new TestPage(page);
      await testPage.goto('/');
      
      const title = await testPage.getPageTitle();
      expect(title).toContain('ClearDay');
    });

    test('BasePage can wait for elements', async ({ page }) => {
      const testPage = new TestPage(page);
      await testPage.goto('/');
      
      // Should not throw when waiting for existing element
      await testPage.waitForElement('main');
      
      const isVisible = await testPage.isVisible('main');
      expect(isVisible).toBe(true);
    });

    test('BasePage can interact with elements', async ({ page }) => {
      const testPage = new TestPage(page);
      await testPage.goto('/');
      
      const text = await testPage.getElementText('h1');
      expect(text).toContain('Your day, already sorted');
    });
  });

  test.describe('DataHelpers', () => {
    test('generateRandomEmail creates valid email', () => {
      const email = DataHelpers.generateRandomEmail();
      expect(email).toMatch(/^test-\d+-[a-z0-9]+@example\.com$/);
    });

    test('generateRandomId creates unique ids', () => {
      const id1 = DataHelpers.generateRandomId();
      const id2 = DataHelpers.generateRandomId();
      
      expect(id1).toMatch(/^id-\d+-[a-z0-9]+$/);
      expect(id2).toMatch(/^id-\d+-[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });

    test('generateRandomString creates strings of correct length', () => {
      const str1 = DataHelpers.generateRandomString(5);
      const str2 = DataHelpers.generateRandomString(10);
      
      expect(str1).toHaveLength(5);
      expect(str2).toHaveLength(10);
    });

    test('generateRandomDate creates valid dates', () => {
      const date = DataHelpers.generateRandomDate();
      expect(new Date(date)).toBeInstanceOf(Date);
      expect(new Date(date).toISOString()).toBe(date);
    });

    test('generateRandomTask creates valid task', () => {
      const task = DataHelpers.generateRandomTask({
        title: 'Custom Task',
        priority: 1
      });
      
      expect(task.id).toMatch(/^id-\d+-[a-z0-9]+$/);
      expect(task.title).toBe('Custom Task');
      expect(task.priority).toBe(1);
      expect(task.completed).toBe(false);
      expect(task.source).toBe('manual');
    });

    test('generateRandomEvent creates valid event', () => {
      const event = DataHelpers.generateRandomEvent({
        title: 'Custom Event',
        allDay: true
      });
      
      expect(event.id).toMatch(/^id-\d+-[a-z0-9]+$/);
      expect(event.title).toBe('Custom Event');
      expect(event.allDay).toBe(true);
      expect(event.attendees).toEqual([]);
    });
  });

  test.describe('Test Data Fixtures', () => {
    test('testUsers contains valid user data', () => {
      expect(testUsers).toHaveLength(2);
      
      const user1 = testUsers[0];
      expect(user1.id).toBe('user-1');
      expect(user1.email).toBe('test1@example.com');
      expect(user1.privacyMode).toBe(false);
      
      const user2 = testUsers[1];
      expect(user2.id).toBe('user-2');
      expect(user2.privacyMode).toBe(true);
      expect(user2.localMode).toBe(true);
    });

    test('testTasks contains valid task data', () => {
      expect(testTasks).toHaveLength(2);
      
      const task1 = testTasks[0];
      expect(task1.id).toBe('task-1');
      expect(task1.title).toBe('Complete project documentation');
      expect(task1.completed).toBe(false);
      expect(task1.priority).toBe(1);
      
      const task2 = testTasks[1];
      expect(task2.id).toBe('task-2');
      expect(task2.title).toBe('Buy groceries');
      expect(task2.completed).toBe(true);
      expect(task2.recurringRule).toBeTruthy();
    });

    test('testEvents contains valid event data', () => {
      expect(testEvents).toHaveLength(2);
      
      const event1 = testEvents[0];
      expect(event1.id).toBe('event-1');
      expect(event1.title).toBe('Team Meeting');
      expect(event1.allDay).toBe(false);
      expect(event1.attendees).toHaveLength(1);
      
      const event2 = testEvents[1];
      expect(event2.id).toBe('event-2');
      expect(event2.title).toBe('Doctor Appointment');
      expect(event2.integrationId).toBeUndefined();
    });

    test('createTestUser creates valid user with overrides', () => {
      const user = createTestUser({
        email: 'custom@example.com',
        fullName: 'Custom User',
        privacyMode: true
      });
      
      expect(user.email).toBe('custom@example.com');
      expect(user.fullName).toBe('Custom User');
      expect(user.privacyMode).toBe(true);
      expect(user.localMode).toBe(false); // default value
    });

    test('createTestTask creates valid task with overrides', () => {
      const task = createTestTask({
        title: 'Custom Task',
        priority: 1,
        completed: true
      });
      
      expect(task.title).toBe('Custom Task');
      expect(task.priority).toBe(1);
      expect(task.completed).toBe(true);
      expect(task.source).toBe('manual'); // default value
    });

    test('createTestEvent creates valid event with overrides', () => {
      const event = createTestEvent({
        title: 'Custom Event',
        allDay: true,
        location: 'Custom Location'
      });
      
      expect(event.title).toBe('Custom Event');
      expect(event.allDay).toBe(true);
      expect(event.location).toBe('Custom Location');
      expect(event.attendees).toEqual([]); // default value
    });

    test('testScenarios provides different user scenarios', () => {
      expect(testScenarios.emptyUser.user).toBeTruthy();
      expect(testScenarios.emptyUser.tasks).toEqual([]);
      expect(testScenarios.emptyUser.events).toEqual([]);
      
      expect(testScenarios.busyUser.user.fullName).toBe('Busy User');
      expect(testScenarios.busyUser.tasks).toHaveLength(2);
      expect(testScenarios.busyUser.events).toHaveLength(2);
      
      expect(testScenarios.privacyFocusedUser.user.privacyMode).toBe(true);
      expect(testScenarios.privacyFocusedUser.user.localMode).toBe(true);
      expect(testScenarios.privacyFocusedUser.events).toEqual([]);
    });
  });

  test.describe('Utility Functions', () => {
    test('waitForTimeout waits for specified time', async () => {
      const start = Date.now();
      await waitForTimeout(100);
      const end = Date.now();
      
      expect(end - start).toBeGreaterThanOrEqual(100);
    });

    test('retry retries failed operations', async () => {
      let attempts = 0;
      const failingOperation = async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Temporary failure');
        }
        return 'success';
      };
      
      const result = await retry(failingOperation, 3, 10);
      expect(result).toBe('success');
      expect(attempts).toBe(3);
    });

    test('retry throws after max attempts', async () => {
      const alwaysFailingOperation = async () => {
        throw new Error('Always fails');
      };
      
      await expect(retry(alwaysFailingOperation, 2, 10)).rejects.toThrow('Always fails');
    });

    test('createTestId creates correct selector', () => {
      const selector = createTestId('test-button');
      expect(selector).toBe('[data-testid="test-button"]');
    });

    test('createAriaLabel creates correct selector', () => {
      const selector = createAriaLabel('Close dialog');
      expect(selector).toBe('[aria-label="Close dialog"]');
    });

    test('createTextSelector creates correct selector', () => {
      const selector = createTextSelector('Submit');
      expect(selector).toBe('text=Submit');
    });
  });

  test.describe('AssertionHelpers', () => {
    test('assertElementVisible passes for visible elements', async ({ page }) => {
      await page.goto('/');
      await AssertionHelpers.assertElementVisible(page, 'main');
    });

    test('assertElementVisible throws for hidden elements', async ({ page }) => {
      await page.goto('/');
      await expect(
        AssertionHelpers.assertElementVisible(page, '[data-testid="non-existent"]')
      ).rejects.toThrow();
    });

    test('assertTextContains passes for matching text', async ({ page }) => {
      await page.goto('/');
      await AssertionHelpers.assertTextContains(page, 'h1', 'Your day');
    });

    test('assertTextContains throws for non-matching text', async ({ page }) => {
      await page.goto('/');
      await expect(
        AssertionHelpers.assertTextContains(page, 'h1', 'Non-existent text')
      ).rejects.toThrow();
    });

    test('assertUrl passes for matching URL', async ({ page }) => {
      await page.goto('/');
      await AssertionHelpers.assertUrl(page, 'localhost:3000');
    });

    test('assertElementCount passes for correct count', async ({ page }) => {
      await page.goto('/');
      await AssertionHelpers.assertElementCount(page, 'h3', 3); // feature cards
    });
  });

  test.describe('PerformanceHelpers', () => {
    test('measurePageLoadTime returns load time', async ({ page }) => {
      await page.goto('/');
      const loadTime = await PerformanceHelpers.measurePageLoadTime(page);
      expect(loadTime).toBeGreaterThan(0);
    });

    test('assertPageLoadTime passes for fast loading', async ({ page }) => {
      await page.goto('/');
      await PerformanceHelpers.assertPageLoadTime(page, 10000); // 10 second limit
    });
  });

  test.describe('Integration with real page', () => {
    test('utilities work with actual page elements', async ({ page }) => {
      const testPage = new TestPage(page);
      await testPage.goto('/');
      
      // Test navigation
      await testPage.waitForPageLoad();
      
      // Test element interaction
      const title = await testPage.getElementText('h1');
      expect(title).toContain('Your day, already sorted');
      
      // Test visibility
      await AssertionHelpers.assertElementVisible(page, 'main');
      await AssertionHelpers.assertElementVisible(page, 'header');
      
      // Test text content
      await AssertionHelpers.assertTextContains(page, 'h1', 'Your day, already sorted');
      
      // Test element count
      await AssertionHelpers.assertElementCount(page, 'button', 2); // Get Started and Learn More buttons
    });
  });
});

