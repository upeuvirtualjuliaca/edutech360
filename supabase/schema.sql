-- ══════════════════════════════════════════════════════════════
-- EduTech360 — Schema Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════

-- ── Tabla: docentes ────────────────────────────────────────────
-- Almacena el padrón de docentes importado desde Excel.
-- El formulario de inscripción consulta esta tabla por DNI.

CREATE TABLE IF NOT EXISTS public.docentes (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dni                  TEXT UNIQUE NOT NULL,
  apellidos_nombres    TEXT NOT NULL,
  campus               TEXT,
  facultad             TEXT,
  escuela_profesional  TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsqueda rápida por DNI
CREATE INDEX IF NOT EXISTS idx_docentes_dni ON public.docentes (dni);

-- ── Tabla: registrations ───────────────────────────────────────
-- Almacena las inscripciones de docentes al evento.

CREATE TABLE IF NOT EXISTS public.registrations (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dni                  TEXT NOT NULL,
  apellidos_nombres    TEXT NOT NULL,
  campus               TEXT,
  facultad             TEXT,
  escuela_profesional  TEXT,
  ciudad               TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (dni)
);

CREATE INDEX IF NOT EXISTS idx_registrations_dni ON public.registrations (dni);

-- ── Row Level Security (RLS) ───────────────────────────────────

ALTER TABLE public.docentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Lectura pública (el formulario consulta sin autenticación)
CREATE POLICY "Lectura pública de docentes"
  ON public.docentes FOR SELECT
  USING (true);

-- Solo usuarios autenticados (admin) pueden insertar/actualizar/eliminar docentes
CREATE POLICY "Admin puede gestionar docentes"
  ON public.docentes FOR ALL
  USING (auth.role() = 'authenticated');

-- Cualquiera puede insertar una inscripción
CREATE POLICY "Inscripción pública"
  ON public.registrations FOR INSERT
  WITH CHECK (true);

-- Lectura pública de inscripciones (para el lookup de "¿ya estoy inscrito?")
CREATE POLICY "Lectura pública de registros"
  ON public.registrations FOR SELECT
  USING (true);

-- Solo admin puede eliminar o actualizar registros
CREATE POLICY "Admin puede gestionar registros"
  ON public.registrations FOR ALL
  USING (auth.role() = 'authenticated');
