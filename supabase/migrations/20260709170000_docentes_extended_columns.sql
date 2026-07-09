-- ══════════════════════════════════════════════════════════════
-- EduTech360 — Ampliar tabla docentes con todas las columnas del Excel
-- Columnas adicionales del padrón académico oficial
-- ══════════════════════════════════════════════════════════════

ALTER TABLE public.docentes
  ADD COLUMN IF NOT EXISTS grado_academico               TEXT,
  ADD COLUMN IF NOT EXISTS tipo_documento                TEXT,
  ADD COLUMN IF NOT EXISTS regimen_dedicacion            TEXT,
  ADD COLUMN IF NOT EXISTS condicion_laboral             TEXT,
  ADD COLUMN IF NOT EXISTS campus_asignatura             TEXT,
  ADD COLUMN IF NOT EXISTS asignatura                    TEXT,
  ADD COLUMN IF NOT EXISTS tipo_curso                    TEXT,
  ADD COLUMN IF NOT EXISTS credito                       TEXT,
  ADD COLUMN IF NOT EXISTS ct                            TEXT,
  ADD COLUMN IF NOT EXISTS cp                            TEXT,
  ADD COLUMN IF NOT EXISTS ht                            TEXT,
  ADD COLUMN IF NOT EXISTS hp                            TEXT,
  ADD COLUMN IF NOT EXISTS hnp                           TEXT,
  ADD COLUMN IF NOT EXISTS total_horas                   TEXT,
  ADD COLUMN IF NOT EXISTS ciclo                         TEXT,
  ADD COLUMN IF NOT EXISTS ambiente                      TEXT,
  ADD COLUMN IF NOT EXISTS cupo                          TEXT,
  ADD COLUMN IF NOT EXISTS condicion_docente             TEXT,
  ADD COLUMN IF NOT EXISTS horas_lectivas                TEXT,
  ADD COLUMN IF NOT EXISTS factor                        TEXT,
  ADD COLUMN IF NOT EXISTS horas_laborales               TEXT,
  ADD COLUMN IF NOT EXISTS horas_lectivas_semanales      TEXT,
  ADD COLUMN IF NOT EXISTS factor_semanal                TEXT,
  ADD COLUMN IF NOT EXISTS horas_laborales_semanales     TEXT,
  ADD COLUMN IF NOT EXISTS horas_laborales_semanales_carga TEXT,
  ADD COLUMN IF NOT EXISTS tipo                          TEXT;
