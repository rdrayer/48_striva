-- both test users have the password "password"

INSERT INTO users (username, password, first_name, last_name, email)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User',
        'joel@joelburton.com'),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Admin!',
        'joel@joelburton.com');

INSERT INTO activities (activity, distance, activity_datetime, activity_duration, title, description, user_id)
VALUES  ('run', 3.2, '2024-04-28 07:00:00', 30, 'Morning Run', 'Quick morning run around the neighborhood.', 'testuser'),
        ('hike', 5.0, '2024-04-29 09:00:00', 120, 'Mountain Hike', 'Hiking up the local mountain.', 'testuser'),
        ('cycle', 15.5, '2024-04-30 06:30:00', 45, 'Early Cycling', 'Road cycling at dawn.', 'testuser'),
        ('yoga', 0, '2024-05-01 08:00:00', 60, 'Yoga Session', 'Morning yoga to start the day refreshed.', 'testuser'),
        ('weight training', 0, '2024-05-02 18:00:00', 50, 'Gym Weights', 'Evening weight lifting session.', 'testuser'),
        ('swim', 2.0, '2024-05-03 07:30:00', 30, 'Morning Swim', 'Swimming laps at the community pool.', 'testuser'),
        ('boxing', 0, '2024-05-04 17:00:00', 60, 'Boxing Training', 'Intense boxing training.', 'testuser'),
        ('soccer', 0, '2024-05-05 16:00:00', 90, 'Soccer Match', 'Friendly soccer match with local team.', 'testuser'),
        ('weight training', 0, '2024-05-06 19:00:00', 40, 'Home Workout', 'Bodyweight exercises at home.', 'testuser'),
        ('walking', 1.5, '2024-05-07 20:00:00', 20, 'Evening Walk', 'Relaxing walk after dinner.', 'testuser');