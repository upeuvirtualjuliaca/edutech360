-- ══════════════════════════════════════════════════════════════
-- EduTech360 — Actualizar políticas RLS de la tabla admins
-- Permite que los admins gestionen todos los registros
-- ══════════════════════════════════════════════════════════════

-- Eliminar la política restrictiva anterior (solo perfil propio)
DROP POLICY IF EXISTS "Admin puede ver su perfil" ON public.admins;

-- SELECT: cualquier admin puede ver todos los registros
CREATE POLICY "Admins pueden ver todos los administradores"
  ON public.admins FOR SELECT
  USING (public.is_admin());

-- INSERT: cualquier admin puede agregar nuevos administradores
CREATE POLICY "Admins pueden agregar administradores"
  ON public.admins FOR INSERT
  WITH CHECK (public.is_admin());

-- DELETE: cualquier admin puede eliminar otros administradores (no a sí mismo)
CREATE POLICY "Admins pueden eliminar administradores"
  ON public.admins FOR DELETE
  USING (public.is_admin() AND id != auth.uid());
