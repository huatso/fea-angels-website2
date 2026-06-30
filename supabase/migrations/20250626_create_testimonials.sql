-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  quote TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT '',
  company TEXT DEFAULT '',
  type TEXT NOT NULL DEFAULT 'investor' CHECK (type IN ('investor', 'founder')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Testimonials public read" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Testimonials authenticated insert" ON testimonials FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Testimonials authenticated update" ON testimonials FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Testimonials authenticated delete" ON testimonials FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO testimonials (quote, name, role, company, type, sort_order) VALUES
  ('A rede da FEA Angels me deu acesso a dealflow qualificado que nunca teria encontrado sozinho. Em dois anos fiz três investimentos e aprendi muito com os comitês de avaliação.', 'João M.', 'Associado desde 2021', 'Ex-Diretor de M&A, multinacional de tecnologia', 'investor', 0),
  ('O processo de curadoria é sério e respeitoso. Quando recebemos o investimento, vieram junto mentores que abriram portas que levariam anos a abrir por conta própria.', 'Ana P.', 'CEO & Co-fundadora', 'Startup de Healthtech, portfólio 2023', 'founder', 1),
  ('O que me atraiu foi a qualidade dos co-investidores. São profissionais com experiência real em operações — não apenas capital, mas conhecimento genuíno sobre o que uma startup precisa.', 'Carlos R.', 'Associado desde 2020', 'CFO em empresa de tecnologia SaaS', 'investor', 2);
