CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Newsletter public insert" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Newsletter authenticated select" ON newsletter_subscribers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Newsletter authenticated delete" ON newsletter_subscribers FOR DELETE USING (auth.role() = 'authenticated');
