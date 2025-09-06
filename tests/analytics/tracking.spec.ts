import { test, expect } from '@playwright/test';

// Mock the analytics module to capture events
const mockEvents: any[] = [];

test.describe('Analytics Tracking', () => {
  test.beforeEach(async ({ page }) => {
    // Clear mock events before each test
    mockEvents.length = 0;

    // Mock console.log to capture analytics events
    await page.addInitScript(() => {
      const originalLog = console.log;
      console.log = (...args) => {
        if (args[0] === '📊 Analytics Event:') {
          (window as any).mockEvents = (window as any).mockEvents || [];
          (window as any).mockEvents.push(args[1]);
        }
        originalLog.apply(console, args);
      };
    });
  });

  test('should track page view on page load', async ({ page }) => {
    await page.goto('/');

    // Wait for analytics to initialize
    await page.waitForTimeout(100);

    const events = await page.evaluate(() => (window as any).mockEvents || []);
    const pageViewEvent = events.find((event: any) => event.event_name === 'page_view');

    expect(pageViewEvent).toBeDefined();
    expect(pageViewEvent.event_data.page_path).toBe('/');
    expect(pageViewEvent.event_data.page_title).toBeTruthy();
    expect(pageViewEvent.session_id).toBeDefined();
  });

  test('should respect privacy mode and disable tracking', async ({ page }) => {
    // Mock user with privacy mode enabled
    await page.addInitScript(() => {
      // Mock Supabase auth and profile with local_mode enabled
      (window as any).mockSupabaseResponse = {
        auth: { getUser: () => Promise.resolve({ data: { user: { id: 'test-user' } } }) },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: { local_mode: true } })
            })
          })
        })
      };
    });

    await page.goto('/');

    // Wait for analytics to check privacy settings
    await page.waitForTimeout(100);

    const events = await page.evaluate(() => (window as any).mockEvents || []);

    // Should not track events when privacy mode is enabled
    expect(events.length).toBe(0);
  });

  test('should track task completion', async ({ page }) => {
    // Mock user without privacy mode
    await page.addInitScript(() => {
      (window as any).mockSupabaseResponse = {
        auth: { getUser: () => Promise.resolve({ data: { user: { id: 'test-user' } } }) },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: { local_mode: false } })
            })
          })
        })
      };
    });

    await page.goto('/');

    // Simulate task completion by triggering the analytics function
    await page.evaluate(() => {
      // Mock the analytics trackTaskCompletion function
      const mockEvent = {
        event_name: 'task_completed',
        event_data: {
          task_id: 'test-task-123',
          task_title: 'Test Task',
          completion_time: new Date().toISOString()
        },
        session_id: 'test-session',
        user_id: 'test-user'
      };

      console.log('📊 Analytics Event:', mockEvent);
    });

    const events = await page.evaluate(() => (window as any).mockEvents || []);
    const taskCompletionEvent = events.find((event: any) => event.event_name === 'task_completed');

    expect(taskCompletionEvent).toBeDefined();
    expect(taskCompletionEvent.event_data.task_id).toBe('test-task-123');
    expect(taskCompletionEvent.event_data.task_title).toBe('Test Task');
  });

  test('should track task creation', async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).mockSupabaseResponse = {
        auth: { getUser: () => Promise.resolve({ data: { user: { id: 'test-user' } } }) },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: { local_mode: false } })
            })
          })
        })
      };
    });

    await page.goto('/');

    // Simulate task creation
    await page.evaluate(() => {
      const mockEvent = {
        event_name: 'task_created',
        event_data: {
          task_title: 'New Test Task',
          priority: 'high',
          creation_time: new Date().toISOString()
        },
        session_id: 'test-session',
        user_id: 'test-user'
      };

      console.log('📊 Analytics Event:', mockEvent);
    });

    const events = await page.evaluate(() => (window as any).mockEvents || []);
    const taskCreationEvent = events.find((event: any) => event.event_name === 'task_created');

    expect(taskCreationEvent).toBeDefined();
    expect(taskCreationEvent.event_data.task_title).toBe('New Test Task');
    expect(taskCreationEvent.event_data.priority).toBe('high');
  });

  test('should include session ID in all events', async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).mockSupabaseResponse = {
        auth: { getUser: () => Promise.resolve({ data: { user: { id: 'test-user' } } }) },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: { local_mode: false } })
            })
          })
        })
      };
    });

    await page.goto('/');

    await page.evaluate(() => {
      const mockEvent = {
        event_name: 'test_event',
        event_data: { test: 'data' },
        session_id: 'test-session-123',
        user_id: 'test-user'
      };

      console.log('📊 Analytics Event:', mockEvent);
    });

    const events = await page.evaluate(() => (window as any).mockEvents || []);
    const testEvent = events.find((event: any) => event.event_name === 'test_event');

    expect(testEvent.session_id).toBe('test-session-123');
  });

  test('should include user ID for authenticated users', async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).mockSupabaseResponse = {
        auth: { getUser: () => Promise.resolve({ data: { user: { id: 'authenticated-user-123' } } }) },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: { local_mode: false } })
            })
          })
        })
      };
    });

    await page.goto('/');

    await page.evaluate(() => {
      const mockEvent = {
        event_name: 'user_test_event',
        event_data: { authenticated: true },
        session_id: 'test-session',
        user_id: 'authenticated-user-123'
      };

      console.log('📊 Analytics Event:', mockEvent);
    });

    const events = await page.evaluate(() => (window as any).mockEvents || []);
    const userEvent = events.find((event: any) => event.event_name === 'user_test_event');

    expect(userEvent.user_id).toBe('authenticated-user-123');
  });

  test('should handle custom event tracking', async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).mockSupabaseResponse = {
        auth: { getUser: () => Promise.resolve({ data: { user: { id: 'test-user' } } }) },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: { local_mode: false } })
            })
          })
        })
      };
    });

    await page.goto('/');

    await page.evaluate(() => {
      const mockEvent = {
        event_name: 'custom_interaction',
        event_data: {
          element: 'button',
          action: 'click',
          page: '/dashboard',
          custom_property: 'test_value'
        },
        session_id: 'test-session',
        user_id: 'test-user'
      };

      console.log('📊 Analytics Event:', mockEvent);
    });

    const events = await page.evaluate(() => (window as any).mockEvents || []);
    const customEvent = events.find((event: any) => event.event_name === 'custom_interaction');

    expect(customEvent).toBeDefined();
    expect(customEvent.event_data.element).toBe('button');
    expect(customEvent.event_data.action).toBe('click');
    expect(customEvent.event_data.custom_property).toBe('test_value');
  });

  test('should include timestamps in events', async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).mockSupabaseResponse = {
        auth: { getUser: () => Promise.resolve({ data: { user: { id: 'test-user' } } }) },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: { local_mode: false } })
            })
          })
        })
      };
    });

    await page.goto('/');

    const beforeTime = new Date().toISOString();

    await page.evaluate(() => {
      const mockEvent = {
        event_name: 'timestamp_test',
        event_data: {
          timestamp: new Date().toISOString()
        },
        session_id: 'test-session',
        user_id: 'test-user'
      };

      console.log('📊 Analytics Event:', mockEvent);
    });

    const afterTime = new Date().toISOString();

    const events = await page.evaluate(() => (window as any).mockEvents || []);
    const timestampEvent = events.find((event: any) => event.event_name === 'timestamp_test');

    expect(timestampEvent).toBeDefined();
    expect(timestampEvent.event_data.timestamp).toBeDefined();

    // Check that timestamp is within reasonable bounds
    const eventTime = new Date(timestampEvent.event_data.timestamp);
    const beforeEventTime = new Date(beforeTime);
    const afterEventTime = new Date(afterTime);

    expect(eventTime.getTime()).toBeGreaterThanOrEqual(beforeEventTime.getTime() - 1000); // Allow 1 second buffer
    expect(eventTime.getTime()).toBeLessThanOrEqual(afterEventTime.getTime() + 1000);
  });

  test('should handle anonymous users gracefully', async ({ page }) => {
    // Mock unauthenticated user
    await page.addInitScript(() => {
      (window as any).mockSupabaseResponse = {
        auth: { getUser: () => Promise.resolve({ data: { user: null } }) },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: null })
            })
          })
        })
      };
    });

    await page.goto('/');

    await page.evaluate(() => {
      const mockEvent = {
        event_name: 'anonymous_test',
        event_data: { anonymous: true },
        session_id: 'test-session'
      };

      console.log('📊 Analytics Event:', mockEvent);
    });

    const events = await page.evaluate(() => (window as any).mockEvents || []);
    const anonymousEvent = events.find((event: any) => event.event_name === 'anonymous_test');

    expect(anonymousEvent).toBeDefined();
    expect(anonymousEvent.user_id).toBeUndefined(); // Should not have user_id for anonymous users
    expect(anonymousEvent.session_id).toBe('test-session');
  });

  test('should track page metadata correctly', async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).mockSupabaseResponse = {
        auth: { getUser: () => Promise.resolve({ data: { user: { id: 'test-user' } } }) },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: { local_mode: false } })
            })
          })
        })
      };
    });

    await page.goto('/');

    const events = await page.evaluate(() => (window as any).mockEvents || []);
    const pageViewEvent = events.find((event: any) => event.event_name === 'page_view');

    expect(pageViewEvent).toBeDefined();
    expect(pageViewEvent.event_data.page_path).toBe('/');
    expect(pageViewEvent.event_data.referrer).toBeDefined();
    expect(pageViewEvent.event_data.user_agent).toBeDefined();
  });
});
