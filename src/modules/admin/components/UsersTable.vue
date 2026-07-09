<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getAdmins, createAdmin, removeAdmin, type AdminUser } from '@/services/adminUsers'

const auth = useAuthStore()

const admins = ref<AdminUser[]>([])
const loading = ref(false)
const loadError = ref('')

const showModal = ref(false)
const form = ref({ email: '', password: '', confirmPassword: '' })
const formError = ref('')
const creating = ref(false)
const successMsg = ref('')

const deleting = ref<string | null>(null)

async function load() {
  loading.value = true
  loadError.value = ''
  try {
    admins.value = await getAdmins()
  } catch (e: unknown) {
    loadError.value = e instanceof Error ? e.message : 'Error al cargar usuarios'
  } finally {
    loading.value = false
  }
}

function openModal() {
  form.value = { email: '', password: '', confirmPassword: '' }
  formError.value = ''
  successMsg.value = ''
  showModal.value = true
}

async function handleCreate() {
  formError.value = ''
  successMsg.value = ''
  if (!form.value.email.trim()) { formError.value = 'El email es requerido'; return }
  if (form.value.password.length < 6) { formError.value = 'La contraseña debe tener al menos 6 caracteres'; return }
  if (form.value.password !== form.value.confirmPassword) { formError.value = 'Las contraseñas no coinciden'; return }

  creating.value = true
  try {
    await createAdmin(form.value.email.trim(), form.value.password)
    successMsg.value = `Administrador creado. Se envió confirmación a ${form.value.email}.`
    await load()
    setTimeout(() => { showModal.value = false; successMsg.value = '' }, 3000)
  } catch (e: unknown) {
    formError.value = e instanceof Error ? e.message : 'Error al crear el administrador'
  } finally {
    creating.value = false
  }
}

async function handleRemove(admin: AdminUser) {
  if (!confirm(`¿Revocar el acceso de administrador a ${admin.email}?\nEsta acción no se puede deshacer.`)) return
  deleting.value = admin.id
  try {
    await removeAdmin(admin.id)
    await load()
  } catch (e: unknown) {
    alert(e instanceof Error ? e.message : 'Error al eliminar el administrador')
  } finally {
    deleting.value = null
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-PE', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

onMounted(load)
</script>

<template>
  <div class="flex flex-col gap-4">

    <!-- Header: contador + botón agregar -->
    <div class="flex items-center justify-between">
      <p class="text-sm text-slate-500">
        <span class="font-semibold text-slate-800">{{ admins.length }}</span>
        {{ admins.length === 1 ? 'administrador registrado' : 'administradores registrados' }}
      </p>
      <button
        type="button"
        class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
               text-white transition-all duration-150 cursor-pointer shadow-sm hover:opacity-90 active:scale-95"
        style="background: linear-gradient(135deg, #2563eb, #06b6d4);"
        @click="openModal"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
        </svg>
        Agregar administrador
      </button>
    </div>

    <!-- Error de carga -->
    <div v-if="loadError" class="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
      {{ loadError }}
    </div>

    <!-- Skeleton / tabla -->
    <div class="overflow-hidden rounded-xl border border-slate-200">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-200">
            <th class="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
            <th class="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Registrado</th>
            <th class="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <!-- Loading skeleton -->
          <template v-if="loading">
            <tr v-for="n in 3" :key="n" class="border-b border-slate-100 last:border-0">
              <td class="px-4 py-3">
                <div class="h-4 bg-slate-200 rounded animate-pulse w-48"></div>
              </td>
              <td class="px-4 py-3 hidden sm:table-cell">
                <div class="h-4 bg-slate-200 rounded animate-pulse w-32"></div>
              </td>
              <td class="px-4 py-3"></td>
            </tr>
          </template>

          <!-- Sin resultados -->
          <tr v-else-if="admins.length === 0">
            <td colspan="3" class="px-4 py-10 text-center text-slate-400 text-sm">
              No hay administradores registrados.
            </td>
          </tr>

          <!-- Filas -->
          <tr
            v-for="admin in admins"
            :key="admin.id"
            class="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
          >
            <!-- Email + badge "tú" -->
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <div
                  class="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white shrink-0"
                  style="background: linear-gradient(135deg, #2563eb, #06b6d4);"
                >
                  {{ admin.email.slice(0, 2).toUpperCase() }}
                </div>
                <span class="text-slate-800 font-medium truncate max-w-xs">{{ admin.email }}</span>
                <span
                  v-if="admin.id === auth.user?.id"
                  class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-cyan-600"
                  style="background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.25);"
                >
                  Tú
                </span>
              </div>
            </td>

            <!-- Fecha -->
            <td class="px-4 py-3 text-slate-500 text-xs hidden sm:table-cell">
              {{ formatDate(admin.created_at) }}
            </td>

            <!-- Acción eliminar -->
            <td class="px-4 py-3 text-right">
              <button
                v-if="admin.id !== auth.user?.id"
                type="button"
                :disabled="deleting === admin.id"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ml-auto
                       text-red-500 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer
                       disabled:opacity-50 disabled:cursor-not-allowed"
                @click="handleRemove(admin)"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                {{ deleting === admin.id ? 'Eliminando...' : 'Revocar' }}
              </button>
              <span v-else class="text-xs text-slate-300 pr-2">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal: Agregar administrador -->
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="showModal = false"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5"
          style="border: 1px solid rgba(0,0,0,0.06);"
        >
          <!-- Header modal -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-black text-slate-900">Nuevo administrador</h3>
              <p class="text-xs text-slate-400 mt-0.5">El usuario recibirá un email de confirmación.</p>
            </div>
            <button
              type="button"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400
                     hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              @click="showModal = false"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Mensaje de éxito -->
          <div
            v-if="successMsg"
            class="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 font-medium"
          >
            {{ successMsg }}
          </div>

          <!-- Formulario -->
          <form v-else class="flex flex-col gap-4" @submit.prevent="handleCreate">
            <!-- Email -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-700 uppercase tracking-wide">Email</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="correo@upeu.edu.pe"
                autocomplete="off"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800
                       placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2
                       focus:ring-blue-100 transition-all"
              />
            </div>

            <!-- Contraseña -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-700 uppercase tracking-wide">Contraseña</label>
              <input
                v-model="form.password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                autocomplete="new-password"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800
                       placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2
                       focus:ring-blue-100 transition-all"
              />
            </div>

            <!-- Confirmar contraseña -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-700 uppercase tracking-wide">Confirmar contraseña</label>
              <input
                v-model="form.confirmPassword"
                type="password"
                placeholder="Repite la contraseña"
                autocomplete="new-password"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800
                       placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2
                       focus:ring-blue-100 transition-all"
              />
            </div>

            <!-- Error -->
            <p v-if="formError" class="text-xs text-red-500 font-medium -mt-1">{{ formError }}</p>

            <!-- Botones -->
            <div class="flex gap-3 pt-1">
              <button
                type="button"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600
                       hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                @click="showModal = false"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="creating"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all
                       cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
                style="background: linear-gradient(135deg, #2563eb, #06b6d4);"
              >
                {{ creating ? 'Creando...' : 'Crear administrador' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

  </div>
</template>
