CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1)
);

CREATE TYPE activity_type AS ENUM ('cycle', 'swim', 'run', 'hike', 'soccer', 'row', 'boxing', 'walking', 'weight training', 'yoga');

CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  activity activity_type NOT NULL,
  distance DECIMAL(10, 2) CHECK (distance >= 0),
  activity_datetime TIMESTAMP NOT NULL,
  activity_duration INTEGER NOT NULL,
  title VARCHAR(25) NOT NULL,
  description TEXT,
  user_id VARCHAR(25) NOT NULL REFERENCES users(username)
);

