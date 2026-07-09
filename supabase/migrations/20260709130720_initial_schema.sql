-- ══════════════════════════════════════════════════════════════
-- EduTech360 — Migración inicial
-- Tablas: docentes, registrations + RLS policies
-- ══════════════════════════════════════════════════════════════

-- ── Tabla: docentes ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.docentes (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dni                  TEXT UNIQUE NOT NULL,
  apellidos_nombres    TEXT NOT NULL,
  campus               TEXT,
  facultad             TEXT,
  escuela_profesional  TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_docentes_dni ON public.docentes (dni);

-- ── Tabla: registrations ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.registrations (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dni                  TEXT UNIQUE NOT NULL,
  apellidos_nombres    TEXT NOT NULL,
  campus               TEXT,
  facultad             TEXT,
  escuela_profesional  TEXT,
  ciudad               TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_registrations_dni ON public.registrations (dni);

-- ── Row Level Security ─────────────────────────────────────────
ALTER TABLE public.docentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de docentes"
  ON public.docentes FOR SELECT USING (true);

CREATE POLICY "Admin puede gestionar docentes"
  ON public.docentes FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Inscripción pública"
  ON public.registrations FOR INSERT WITH CHECK (true);

CREATE POLICY "Lectura pública de registros"
  ON public.registrations FOR SELECT USING (true);

CREATE POLICY "Admin puede gestionar registros"
  ON public.registrations FOR ALL USING (auth.role() = 'authenticated');
