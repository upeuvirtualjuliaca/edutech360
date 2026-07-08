export interface Docente {
  dni: string
  apellidosNombres: string
  campus: string
  facultad: string
  escuelaProfesional: string
}

export type DocenteLookupStatus = 'idle' | 'loading' | 'found' | 'not-found'
