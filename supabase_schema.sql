CREATE TABLE expeditions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  species TEXT,
  notes TEXT,
  image_url TEXT,
  user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE marketplace_listings (
  id TEXT PRIMARY KEY,
  batch TEXT NOT NULL,
  origin TEXT NOT NULL,
  status TEXT NOT NULL,
  premium TEXT NOT NULL,
  price TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE fish_records (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id TEXT NOT NULL,
  species TEXT NOT NULL,
  length NUMERIC NOT NULL,
  weight NUMERIC NOT NULL,
  location TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  sex TEXT,
  gear_type TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sensor_packets (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  node TEXT NOT NULL,
  payload JSONB NOT NULL,
  integrity TEXT NOT NULL,
  status TEXT NOT NULL
);
