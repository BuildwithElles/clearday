-- ClearDay Development Seed Data
-- This script creates test data for local development
-- It can be run multiple times safely (uses ON CONFLICT clauses)

-- Clean up existing seed data (optional - uncomment if you want fresh data each time)
-- DELETE FROM public.nudges WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@clearday.test');
-- DELETE FROM public.reminders WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@clearday.test');
-- DELETE FROM public.habits WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@clearday.test');
-- DELETE FROM public.events WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@clearday.test');
-- DELETE FROM public.tasks WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@clearday.test');
-- DELETE FROM public.integrations WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@clearday.test');
-- DELETE FROM public.profiles WHERE email LIKE '%@clearday.test';
-- DELETE FROM auth.users WHERE email LIKE '%@clearday.test';

-- Create test users in auth.users
-- These will automatically create corresponding profiles via our trigger

DO $$
DECLARE
    user1_id UUID := 'd1f7b8a9-8c2e-4b7a-9f3e-1a2b3c4d5e6f';
    user2_id UUID := 'a2e6c9d8-7b1f-4e8a-8d2c-9f3e1a2b3c4d';
    user3_id UUID := 'b3f7d8e9-6c4a-5f9b-7e1d-8a2c3b4f5e6d';
    household_id UUID := 'c4a8e9f1-5d3b-6c7e-9a2f-1b3d4c5f6e7a';
    integration1_id UUID := 'e5b9f2a3-4e6c-7d8f-8b1e-2c4d5f6a7b8c';
    integration2_id UUID := 'f6c1a3b4-3f7e-8a9c-9c2f-3d5e6a7c8d9e';
BEGIN
    -- Test User 1: John Doe (Power user with household)
    INSERT INTO auth.users (
        id, 
        instance_id, 
        aud, 
        role, 
        email, 
        raw_user_meta_data, 
        created_at, 
        updated_at,
        email_confirmed_at,
        confirmation_sent_at
    ) VALUES (
        user1_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'john.doe@clearday.test',
        '{"full_name": "John Doe", "avatar_url": "https://api.dicebear.com/7.x/avatars/svg?seed=john"}',
        NOW(),
        NOW(),
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        raw_user_meta_data = EXCLUDED.raw_user_meta_data,
        updated_at = NOW();

    -- Test User 2: Jane Smith (Member of John's household)
    INSERT INTO auth.users (
        id, 
        instance_id, 
        aud, 
        role, 
        email, 
        raw_user_meta_data, 
        created_at, 
        updated_at,
        email_confirmed_at,
        confirmation_sent_at
    ) VALUES (
        user2_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'jane.smith@clearday.test',
        '{"full_name": "Jane Smith", "avatar_url": "https://api.dicebear.com/7.x/avatars/svg?seed=jane"}',
        NOW(),
        NOW(),
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        raw_user_meta_data = EXCLUDED.raw_user_meta_data,
        updated_at = NOW();

    -- Test User 3: Bob Wilson (Individual user)
    INSERT INTO auth.users (
        id, 
        instance_id, 
        aud, 
        role, 
        email, 
        raw_user_meta_data, 
        created_at, 
        updated_at,
        email_confirmed_at,
        confirmation_sent_at
    ) VALUES (
        user3_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'bob.wilson@clearday.test',
        '{"full_name": "Bob Wilson", "avatar_url": "https://api.dicebear.com/7.x/avatars/svg?seed=bob"}',
        NOW(),
        NOW(),
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        raw_user_meta_data = EXCLUDED.raw_user_meta_data,
        updated_at = NOW();

    -- Create household (John's family)
    INSERT INTO public.households (
        id,
        name,
        owner_id,
        created_at,
        updated_at
    ) VALUES (
        household_id,
        'The Doe Family',
        user1_id,
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        owner_id = EXCLUDED.owner_id,
        updated_at = NOW();

    -- Update profiles to include household membership
    -- (Profiles should already exist from the auth trigger)
    UPDATE public.profiles SET
        household_id = household_id,
        privacy_mode = false,
        local_mode = false,
        timezone = 'America/New_York',
        updated_at = NOW()
    WHERE id = user1_id;

    UPDATE public.profiles SET
        household_id = household_id,
        privacy_mode = true,
        local_mode = false,
        timezone = 'America/New_York',
        updated_at = NOW()
    WHERE id = user2_id;

    UPDATE public.profiles SET
        privacy_mode = false,
        local_mode = true,
        timezone = 'America/Los_Angeles',
        updated_at = NOW()
    WHERE id = user3_id;

    -- Create sample integrations
    INSERT INTO public.integrations (
        id,
        user_id,
        provider,
        sync_enabled,
        settings,
        created_at,
        updated_at
    ) VALUES (
        integration1_id,
        user1_id,
        'google_calendar',
        true,
        '{"calendar_ids": ["primary", "work@company.com"], "sync_frequency": "15min"}',
        NOW(),
        NOW()
    ), (
        integration2_id,
        user2_id,
        'outlook',
        true,
        '{"calendar_ids": ["Calendar"], "sync_frequency": "30min"}',
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        provider = EXCLUDED.provider,
        settings = EXCLUDED.settings,
        updated_at = NOW();

    -- Create sample tasks
    INSERT INTO public.tasks (
        user_id,
        household_id,
        title,
        description,
        due_date,
        due_time,
        priority,
        tags,
        source,
        completed
    ) VALUES 
    -- John's personal tasks
    (user1_id, NULL, 'Review quarterly reports', 'Go through Q3 financial reports and prepare summary', CURRENT_DATE + 1, '14:00', 3, '{"work", "quarterly"}', 'manual', false),
    (user1_id, NULL, 'Book dentist appointment', 'Schedule 6-month cleaning', CURRENT_DATE + 7, NULL, 2, '{"health", "appointments"}', 'manual', false),
    (user1_id, NULL, 'Update LinkedIn profile', 'Add recent project achievements', CURRENT_DATE + 3, NULL, 1, '{"career", "networking"}', 'manual', false),
    
    -- John's completed tasks
    (user1_id, NULL, 'Morning workout', 'Completed 30-min cardio session', CURRENT_DATE, '07:00', 2, '{"fitness", "daily"}', 'habit', true),
    (user1_id, NULL, 'Check emails', 'Reviewed and responded to important emails', CURRENT_DATE, '09:00', 2, '{"work", "daily"}', 'manual', true),
    
    -- Household shared tasks
    (user1_id, household_id, 'Grocery shopping', 'Weekly grocery run - check shared list', CURRENT_DATE + 2, '10:00', 2, '{"household", "shopping"}', 'manual', false),
    (user2_id, household_id, 'Schedule home maintenance', 'Call HVAC service for annual inspection', CURRENT_DATE + 5, NULL, 3, '{"household", "maintenance"}', 'manual', false),
    (user1_id, household_id, 'Plan weekend trip', 'Research destinations for family weekend getaway', CURRENT_DATE + 4, NULL, 1, '{"family", "travel"}', 'manual', false),
    
    -- Jane's personal tasks  
    (user2_id, NULL, 'Finish project proposal', 'Complete the client presentation for next week', CURRENT_DATE + 2, '16:00', 4, '{"work", "urgent"}', 'manual', false),
    (user2_id, NULL, 'Call mom', 'Weekly check-in call', CURRENT_DATE + 1, '19:00', 2, '{"family", "personal"}', 'manual', false),
    
    -- Bob's tasks
    (user3_id, NULL, 'Learn TypeScript', 'Complete online course modules 1-3', CURRENT_DATE + 10, NULL, 2, '{"learning", "development"}', 'manual', false),
    (user3_id, NULL, 'Meal prep Sunday', 'Prepare meals for the week', CURRENT_DATE + 6, '14:00', 2, '{"health", "routine"}', 'habit', false),
    (user3_id, NULL, 'Pay rent', 'Monthly rent payment due', CURRENT_DATE + 3, NULL, 4, '{"finance", "monthly"}', 'manual', false);

    -- Create sample events
    INSERT INTO public.events (
        user_id,
        integration_id,
        external_id,
        title,
        description,
        location,
        start_time,
        end_time,
        all_day,
        attendees
    ) VALUES 
    -- John's events
    (user1_id, integration1_id, 'cal_001', 'Team standup', 'Daily team sync meeting', 'Conference Room A', 
     CURRENT_DATE + INTERVAL '1 day' + TIME '09:00', CURRENT_DATE + INTERVAL '1 day' + TIME '09:30', false, 
     '[{"email": "team@company.com", "name": "Development Team", "status": "accepted"}]'),
    
    (user1_id, integration1_id, 'cal_002', 'Client presentation', 'Q3 results presentation to key client', 'Zoom Meeting', 
     CURRENT_DATE + INTERVAL '2 days' + TIME '15:00', CURRENT_DATE + INTERVAL '2 days' + TIME '16:00', false, 
     '[{"email": "client@example.com", "name": "Client Team", "status": "pending"}]'),
    
    (user1_id, NULL, NULL, 'Gym session', 'Weekly strength training', 'Local Gym', 
     CURRENT_DATE + INTERVAL '1 day' + TIME '18:00', CURRENT_DATE + INTERVAL '1 day' + TIME '19:30', false, '[]'),
    
    -- Jane's events
    (user2_id, integration2_id, 'outlook_001', 'Design review', 'Review UI/UX mockups with design team', 'Design Studio', 
     CURRENT_DATE + INTERVAL '1 day' + TIME '14:00', CURRENT_DATE + INTERVAL '1 day' + TIME '15:30', false, 
     '[{"email": "design@company.com", "name": "Design Team", "status": "accepted"}]'),
    
    (user2_id, NULL, NULL, 'Doctor appointment', 'Annual checkup', 'Medical Center', 
     CURRENT_DATE + INTERVAL '5 days' + TIME '10:00', CURRENT_DATE + INTERVAL '5 days' + TIME '11:00', false, '[]'),
    
    -- Bob's events
    (user3_id, NULL, NULL, 'Online course', 'TypeScript fundamentals', 'Home Office', 
     CURRENT_DATE + INTERVAL '2 days' + TIME '19:00', CURRENT_DATE + INTERVAL '2 days' + TIME '21:00', false, '[]'),
    
    -- All-day events
    (user1_id, NULL, NULL, 'Company retreat', 'Annual team building event', 'Mountain Resort', 
     CURRENT_DATE + INTERVAL '14 days', CURRENT_DATE + INTERVAL '16 days', true, 
     '[{"email": "hr@company.com", "name": "HR Team", "status": "accepted"}]'),
    
    (user2_id, NULL, NULL, 'Conference', 'UX Design Conference 2024', 'Convention Center', 
     CURRENT_DATE + INTERVAL '21 days', CURRENT_DATE + INTERVAL '22 days', true, '[]');

    -- Create sample reminders
    INSERT INTO public.reminders (
        user_id,
        task_id,
        event_id,
        habit_id,
        scheduled_time,
        message,
        type,
        strategy,
        personalization,
        effectiveness_score
    ) VALUES 
    -- Task reminders
    ((SELECT id FROM public.tasks WHERE title = 'Review quarterly reports' LIMIT 1), NULL, NULL, 
     CURRENT_DATE + INTERVAL '1 day' + TIME '13:30', 'Quarterly reports review in 30 minutes', 'notification', 'smart',
     '{"tone": "professional", "urgency": "medium", "context": "work"}', 0.85),
    
    ((SELECT id FROM public.tasks WHERE title = 'Book dentist appointment' LIMIT 1), NULL, NULL,
     CURRENT_DATE + INTERVAL '7 days' + TIME '09:00', 'Time to schedule your dental cleaning', 'email', 'fixed',
     '{"tone": "friendly", "urgency": "low", "context": "health"}', 0.72),
    
    -- Event reminders
    (NULL, NULL, (SELECT id FROM public.events WHERE title = 'Team standup' LIMIT 1), NULL,
     CURRENT_DATE + INTERVAL '1 day' + TIME '08:45', 'Team standup in 15 minutes', 'notification', 'smart',
     '{"tone": "professional", "urgency": "medium", "context": "work"}', 0.90),
    
    (NULL, NULL, (SELECT id FROM public.events WHERE title = 'Client presentation' LIMIT 1), NULL,
     CURRENT_DATE + INTERVAL '2 days' + TIME '14:30', 'Client presentation prep reminder', 'notification', 'adaptive',
     '{"tone": "professional", "urgency": "high", "context": "work"}', 0.88),
    
    -- Habit reminders (will be linked after habits are created)
    (NULL, NULL, NULL, NULL,
     CURRENT_DATE + TIME '07:00', 'Time for your morning workout!', 'notification', 'smart',
     '{"tone": "motivational", "urgency": "medium", "context": "fitness"}', 0.78),
    
    (NULL, NULL, NULL, NULL,
     CURRENT_DATE + TIME '19:00', 'Evening reflection time', 'notification', 'fixed',
     '{"tone": "casual", "urgency": "low", "context": "wellness"}', 0.65);

    -- Create sample habits
    INSERT INTO public.habits (
        user_id,
        name,
        description,
        frequency,
        target_count,
        current_streak,
        longest_streak,
        auto_rules,
        reminder_time,
        category,
        co2_impact_per_completion
    ) VALUES 
    -- John's habits
    (user1_id, 'Morning Workout', '30-minute cardio or strength training', 'daily', 1, 7, 21,
     '{"time_of_day": "07:00", "location": "home gym"}', '07:00', 'health', 0.5),
    
    (user1_id, 'Read 30 minutes', 'Daily reading for personal development', 'daily', 1, 5, 14,
     '{"time_of_day": "21:00", "trigger": "after dinner"}', '21:00', 'productivity', 0.1),
    
    (user1_id, 'Take stairs', 'Use stairs instead of elevator when possible', 'daily', 3, 12, 30,
     '{"location": "office", "trigger": "entering building"}', NULL, 'eco', 2.0),
    
    -- Jane's habits
    (user2_id, 'Meditation', '10-minute mindfulness practice', 'daily', 1, 3, 7,
     '{"time_of_day": "08:00", "trigger": "after coffee"}', '08:00', 'health', 0.0),
    
    (user2_id, 'Walk to work', 'Walk instead of driving when weather permits', 'weekly', 3, 2, 5,
     '{"time_of_day": "08:30", "location": "home"}', '08:30', 'eco', 5.0),
    
    (user2_id, 'Call family', 'Weekly check-in with family members', 'weekly', 1, 1, 4,
     '{"time_of_day": "19:00", "trigger": "Sunday evening"}', '19:00', 'social', 0.0),
    
    -- Bob's habits
    (user3_id, 'Meal prep', 'Prepare healthy meals for the week', 'weekly', 1, 0, 2,
     '{"time_of_day": "14:00", "trigger": "Sunday afternoon"}', '14:00', 'health', 1.5),
    
    (user3_id, 'Learn coding', 'Practice programming for 1 hour', 'daily', 1, 8, 15,
     '{"time_of_day": "20:00", "trigger": "after dinner"}', '20:00', 'productivity', 0.2),
    
    (user3_id, 'Recycle properly', 'Sort and recycle household waste', 'daily', 1, 15, 25,
     '{"trigger": "taking out trash"}', NULL, 'eco', 1.0);

    -- Create sample nudges
    INSERT INTO public.nudges (
        user_id,
        type,
        title,
        message,
        action_type,
        action_data,
        co2_impact,
        shown_at,
        acted_upon_at,
        expires_at
    ) VALUES 
    -- Eco nudges
    (user1_id, 'eco', 'Sustainable Commute', 'Consider walking or biking to work today - it\'s a beautiful day!', 'button',
     '{"label": "Plan Route", "action": "open_maps"}', 3.5, NULL, NULL, CURRENT_DATE + INTERVAL '1 day'),
    
    (user2_id, 'eco', 'Energy Saving', 'Your home energy usage is 15% higher than usual. Check for unnecessary devices.', 'link',
     '{"label": "View Details", "url": "/energy-dashboard"}', 2.1, CURRENT_DATE - INTERVAL '2 hours', NULL, CURRENT_DATE + INTERVAL '3 days'),
    
    (user3_id, 'eco', 'Plastic Free Day', 'Try going plastic-free today! Bring your reusable water bottle and shopping bags.', 'button',
     '{"label": "Get Tips", "action": "show_tips"}', 1.8, NULL, NULL, CURRENT_DATE + INTERVAL '1 day'),
    
    -- Health nudges
    (user1_id, 'health', 'Hydration Reminder', 'You haven\'t logged water intake today. Stay hydrated!', 'button',
     '{"label": "Log Water", "action": "log_water"}', 0.0, CURRENT_DATE - INTERVAL '1 hour', CURRENT_DATE - INTERVAL '30 minutes', CURRENT_DATE + INTERVAL '6 hours'),
    
    (user2_id, 'health', 'Screen Break', 'You\'ve been working for 2 hours. Take a 5-minute break to stretch!', 'button',
     '{"label": "Take Break", "action": "start_break"}', 0.0, NULL, NULL, CURRENT_DATE + INTERVAL '2 hours'),
    
    -- Productivity nudges
    (user1_id, 'productivity', 'Focus Time', 'Your calendar shows 2 hours of free time. Perfect for deep work!', 'button',
     '{"label": "Start Focus", "action": "start_focus"}', 0.0, NULL, NULL, CURRENT_DATE + INTERVAL '4 hours'),
    
    (user3_id, 'productivity', 'Learning Streak', 'You\'re on a 8-day learning streak! Keep it up!', 'dismiss',
     NULL, 0.0, CURRENT_DATE - INTERVAL '30 minutes', NULL, CURRENT_DATE + INTERVAL '1 day'),
    
    -- Social nudges
    (user2_id, 'social', 'Family Check-in', 'It\'s been 5 days since you called your mom. Consider reaching out!', 'button',
     '{"label": "Call Now", "action": "initiate_call"}', 0.0, NULL, NULL, CURRENT_DATE + INTERVAL '2 days'),
    
    (user1_id, 'social', 'Team Collaboration', 'Your colleague Sarah mentioned needing help with the project. Offer assistance?', 'button',
     '{"label": "Offer Help", "action": "message_colleague"}', 0.0, NULL, NULL, CURRENT_DATE + INTERVAL '1 day');

    -- Link habit reminders to actual habits
    UPDATE public.reminders SET habit_id = (SELECT id FROM public.habits WHERE name = 'Morning Workout' AND user_id = user1_id LIMIT 1)
    WHERE message LIKE '%morning workout%';
    
    UPDATE public.reminders SET habit_id = (SELECT id FROM public.habits WHERE name = 'Meditation' AND user_id = user2_id LIMIT 1)
    WHERE message LIKE '%reflection time%';

END $$;

-- Verify seed data was created
DO $$
DECLARE
    user_count INT;
    profile_count INT;
    task_count INT;
    event_count INT;
    household_count INT;
    integration_count INT;
    reminder_count INT;
    habit_count INT;
    nudge_count INT;
BEGIN
    SELECT COUNT(*) INTO user_count FROM auth.users WHERE email LIKE '%@clearday.test';
    SELECT COUNT(*) INTO profile_count FROM public.profiles WHERE email LIKE '%@clearday.test';
    SELECT COUNT(*) INTO task_count FROM public.tasks WHERE user_id IN (SELECT id FROM public.profiles WHERE email LIKE '%@clearday.test');
    SELECT COUNT(*) INTO event_count FROM public.events WHERE user_id IN (SELECT id FROM public.profiles WHERE email LIKE '%@clearday.test');
    SELECT COUNT(*) INTO household_count FROM public.households WHERE name = 'The Doe Family';
    SELECT COUNT(*) INTO integration_count FROM public.integrations WHERE user_id IN (SELECT id FROM public.profiles WHERE email LIKE '%@clearday.test');
    SELECT COUNT(*) INTO reminder_count FROM public.reminders WHERE user_id IN (SELECT id FROM public.profiles WHERE email LIKE '%@clearday.test');
    SELECT COUNT(*) INTO habit_count FROM public.habits WHERE user_id IN (SELECT id FROM public.profiles WHERE email LIKE '%@clearday.test');
    SELECT COUNT(*) INTO nudge_count FROM public.nudges WHERE user_id IN (SELECT id FROM public.profiles WHERE email LIKE '%@clearday.test');
    
    RAISE NOTICE 'Seed data created successfully:';
    RAISE NOTICE '  Users: %', user_count;
    RAISE NOTICE '  Profiles: %', profile_count;
    RAISE NOTICE '  Tasks: %', task_count;
    RAISE NOTICE '  Events: %', event_count;
    RAISE NOTICE '  Households: %', household_count;
    RAISE NOTICE '  Integrations: %', integration_count;
    RAISE NOTICE '  Reminders: %', reminder_count;
    RAISE NOTICE '  Habits: %', habit_count;
    RAISE NOTICE '  Nudges: %', nudge_count;
    
    IF user_count = 0 OR profile_count = 0 THEN
        RAISE WARNING 'Seed data creation may have failed - check for errors above';
    END IF;
END $$;