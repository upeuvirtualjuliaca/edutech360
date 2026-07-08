export interface Registration {
  id?: string
  dni: string
  apellidosNombres: string
  campus: string
  facultad: string
  escuelaProfesional: string
  ciudad?: string
  createdAt?: string
}

export type RegistrationStatus = 'idle' | 'loading' | 'success' | 'error' | 'already-registered'

export type InquiryStatus = 'idle' | 'loading' | 'found' | 'not-found' | 'error'
