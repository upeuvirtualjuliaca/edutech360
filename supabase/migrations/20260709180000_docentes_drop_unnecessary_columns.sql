-- ══════════════════════════════════════════════════════════════
-- EduTech360 — Eliminar columnas innecesarias de docentes
-- Solo se conservan los campos requeridos para el formulario
-- de inscripción: dni, apellidos_nombres, campus, facultad,
-- escuela_profesional
-- ══════════════════════════════════════════════════════════════

ALTER TABLE public.docentes
  DROP COLUMN IF EXISTS grado_academico,
  DROP COLUMN IF EXISTS tipo_documento,
  DROP COLUMN IF EXISTS regimen_dedicacion,
  DROP COLUMN IF EXISTS condicion_laboral,
  DROP COLUMN IF EXISTS condicion_docente,
  DROP COLUMN IF EXISTS campus_asignatura,
  DROP COLUMN IF EXISTS asignatura,
  DROP COLUMN IF EXISTS tipo_curso,
  DROP COLUMN IF EXISTS credito,
  DROP COLUMN IF EXISTS ct,
  DROP COLUMN IF EXISTS cp,
  DROP COLUMN IF EXISTS ht,
  DROP COLUMN IF EXISTS hp,
  DROP COLUMN IF EXISTS hnp,
  DROP COLUMN IF EXISTS total_horas,
  DROP COLUMN IF EXISTS ciclo,
  DROP COLUMN IF EXISTS ambiente,
  DROP COLUMN IF EXISTS cupo,
  DROP COLUMN IF EXISTS horas_lectivas,
  DROP COLUMN IF EXISTS factor,
  DROP COLUMN IF EXISTS horas_laborales,
  DROP COLUMN IF EXISTS horas_lectivas_semanales,
  DROP COLUMN IF EXISTS factor_semanal,
  DROP COLUMN IF EXISTS horas_laborales_semanales,
  DROP COLUMN IF EXISTS horas_laborales_semanales_carga,
  DROP COLUMN IF EXISTS tipo;
