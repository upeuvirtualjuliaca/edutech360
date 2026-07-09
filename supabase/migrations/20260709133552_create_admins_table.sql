-- ══════════════════════════════════════════════════════════════
-- EduTech360 — Tabla de administradores
-- Registra qué usuarios de auth.users tienen rol de admin
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.admins (
  id         UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Solo el propio admin puede leer su registro
CREATE POLICY "Admin puede ver su perfil"
  ON public.admins FOR SELECT
  USING (auth.uid() = id);

-- Función que verifica si el usuario actual es admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins WHERE id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;
