<script setup>
import { ref, computed } from 'vue'

// Estado de la aplicación
const personas = ref([])
const showForm = ref(false)
const editingId = ref(null)

// Formulario
const formData = ref({
  dni: '',
  nombres: '',
  apellidos: '',
  fechaNacimiento: '',
  genero: '',
  ciudad: ''
})

const errors = ref({})

// Ciudades disponibles
const ciudades = [
  'Guayaquil',
  'Quito',
  'Cuenca',
  'Machala',
  'Manta',
  'Portoviejo',
  'Loja',
  'Ambato',
  'Riobamba',
  'Esmeraldas'
]

// Simulación de base de datos en memoria
let nextId = 1

// Validaciones
const validateForm = () => {
  errors.value = {}
  
  // Validar DNI (10 dígitos para Ecuador)
  if (!formData.value.dni.trim()) {
    errors.value.dni = 'El C.I. es requerido'
  } else if (!/^\d{10}$/.test(formData.value.dni)) {
    errors.value.dni = 'El C.I. debe tener 10 dígitos'
  }
  
  // Validar nombres
  if (!formData.value.nombres.trim()) {
    errors.value.nombres = 'Los nombres son requeridos'
  } else if (formData.value.nombres.trim().length < 2) {
    errors.value.nombres = 'Los nombres deben tener al menos 2 caracteres'
  }
  
  // Validar apellidos
  if (!formData.value.apellidos.trim()) {
    errors.value.apellidos = 'Los apellidos son requeridos'
  } else if (formData.value.apellidos.trim().length < 2) {
    errors.value.apellidos = 'Los apellidos deben tener al menos 2 caracteres'
  }
  
  // Validar fecha de nacimiento
  if (!formData.value.fechaNacimiento) {
    errors.value.fechaNacimiento = 'La fecha de nacimiento es requerida'
  } else {
    const fechaNac = new Date(formData.value.fechaNacimiento)
    const hoy = new Date()
    const edad = hoy.getFullYear() - fechaNac.getFullYear()
    if (edad < 0 || edad > 120) {
      errors.value.fechaNacimiento = 'Fecha de nacimiento inválida'
    }
  }
  
  // Validar género
  if (!formData.value.genero) {
    errors.value.genero = 'Debe seleccionar un género'
  }
  
  // Validar ciudad
  if (!formData.value.ciudad) {
    errors.value.ciudad = 'Debe seleccionar una ciudad'
  }
  
  return Object.keys(errors.value).length === 0
}

// CRUD Operations
const createPersona = () => {
  if (!validateForm()) return
  
  const newPersona = {
    id: nextId++,
    ...formData.value
  }
  
  personas.value.push(newPersona)
  resetForm()
  showForm.value = false
}

const updatePersona = () => {
  if (!validateForm()) return
  
  const index = personas.value.findIndex(p => p.id === editingId.value)
  if (index !== -1) {
    personas.value[index] = {
      id: editingId.value,
      ...formData.value
    }
  }
  
  resetForm()
  showForm.value = false
  editingId.value = null
}

const deletePersona = (id) => {
  if (confirm('¿Está seguro de eliminar este registro?')) {
    personas.value = personas.value.filter(p => p.id !== id)
  }
}

const editPersona = (persona) => {
  editingId.value = persona.id
  formData.value = { ...persona }
  showForm.value = true
  errors.value = {}
}

const resetForm = () => {
  formData.value = {
    dni: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    genero: '',
    ciudad: ''
  }
  errors.value = {}
  editingId.value = null
}

const handleSubmit = () => {
  if (editingId.value) {
    updatePersona()
  } else {
    createPersona()
  }
}

const cancelForm = () => {
  resetForm()
  showForm.value = false
}

// Calcular edad
const calcularEdad = (fechaNac) => {
  const hoy = new Date()
  const nacimiento = new Date(fechaNac)
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }
  return edad
}
</script>

<template>
  <div class="container">
    <header>
      <h1>Sistema de Registro de Usuario</h1>
      <p>UltraNano Soluciones</p>
    </header>

    <div class="actions">
      <button 
        v-if="!showForm" 
        @click="showForm = true" 
        class="btn btn-primary"
      >
        ➕ Nueva Persona
      </button>
    </div>

    <!-- Formulario -->
    <div v-if="showForm" class="form-container">
      <h2>{{ editingId ? 'Editar Persona' : 'Nueva Persona' }}</h2>
      
      <form @submit.prevent="handleSubmit">
        <!-- DNI -->
        <div class="form-group">
          <label for="dni">C.I. (Cédula) *</label>
          <input
            id="dni"
            v-model="formData.dni"
            type="text"
            maxlength="10"
            placeholder="1234567890"
            :class="{ 'error': errors.dni }"
          />
          <span v-if="errors.dni" class="error-message">{{ errors.dni }}</span>
        </div>

        <!-- Nombres -->
        <div class="form-group">
          <label for="nombres">Nombres *</label>
          <input
            id="nombres"
            v-model="formData.nombres"
            type="text"
            placeholder="Juan Carlos"
            :class="{ 'error': errors.nombres }"
          />
          <span v-if="errors.nombres" class="error-message">{{ errors.nombres }}</span>
        </div>

        <!-- Apellidos -->
        <div class="form-group">
          <label for="apellidos">Apellidos *</label>
          <input
            id="apellidos"
            v-model="formData.apellidos"
            type="text"
            placeholder="Pérez García"
            :class="{ 'error': errors.apellidos }"
          />
          <span v-if="errors.apellidos" class="error-message">{{ errors.apellidos }}</span>
        </div>

        <!-- Fecha de Nacimiento -->
        <div class="form-group">
          <label for="fechaNacimiento">Fecha de Nacimiento *</label>
          <input
            id="fechaNacimiento"
            v-model="formData.fechaNacimiento"
            type="date"
            :class="{ 'error': errors.fechaNacimiento }"
          />
          <span v-if="errors.fechaNacimiento" class="error-message">{{ errors.fechaNacimiento }}</span>
        </div>

        <!-- Género -->
        <div class="form-group">
          <label>Género *</label>
          <div class="radio-group">
            <label class="radio-label">
              <input
                type="radio"
                v-model="formData.genero"
                value="Masculino"
              />
              <span>Masculino</span>
            </label>
            <label class="radio-label">
              <input
                type="radio"
                v-model="formData.genero"
                value="Femenino"
              />
              <span>Femenino</span>
            </label>
            <label class="radio-label">
              <input
                type="radio"
                v-model="formData.genero"
                value="Otro"
              />
              <span>Otro</span>
            </label>
          </div>
          <span v-if="errors.genero" class="error-message">{{ errors.genero }}</span>
        </div>

        <!-- Ciudad -->
        <div class="form-group">
          <label for="ciudad">Ciudad *</label>
          <select
            id="ciudad"
            v-model="formData.ciudad"
            :class="{ 'error': errors.ciudad }"
          >
            <option value="">Seleccione una ciudad</option>
            <option v-for="ciudad in ciudades" :key="ciudad" :value="ciudad">
              {{ ciudad }}
            </option>
          </select>
          <span v-if="errors.ciudad" class="error-message">{{ errors.ciudad }}</span>
        </div>

        <!-- Botones -->
        <div class="form-actions">
          <button type="submit" class="btn btn-success">
            {{ editingId ? '💾 Actualizar' : '✅ Guardar' }}
          </button>
          <button type="button" @click="cancelForm" class="btn btn-secondary">
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>

    <!-- Tabla de datos -->
    <div v-if="personas.length > 0" class="table-container">
      <h2>Registros ({{ personas.length }})</h2>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>DNI</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Edad</th>
              <th>Género</th>
              <th>Ciudad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="persona in personas" :key="persona.id">
              <td>{{ persona.dni }}</td>
              <td>{{ persona.nombres }}</td>
              <td>{{ persona.apellidos }}</td>
              <td>{{ calcularEdad(persona.fechaNacimiento) }} años</td>
              <td>{{ persona.genero }}</td>
              <td>{{ persona.ciudad }}</td>
              <td class="actions-cell">
                <button
                  @click="editPersona(persona)"
                  class="btn btn-edit"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  @click="deletePersona(persona.id)"
                  class="btn btn-delete"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else-if="!showForm" class="empty-state">
      <p>📋 No hay registros. Haz clic en "Nueva Persona" para comenzar.</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  color: white;
}

header h1 {
  margin: 0;
  font-size: 2.5em;
}

header p {
  margin: 10px 0 0 0;
  opacity: 0.9;
}

.actions {
  margin-bottom: 20px;
  text-align: center;
}

.form-container {
  background: #2c2c2c;
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.form-container h2 {
  margin-top: 0;
  color: #667eea;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #e0e0e0;
}

.form-group input[type="text"],
.form-group input[type="date"],
.form-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #444;
  border-radius: 6px;
  font-size: 16px;
  background: #1a1a1a;
  color: #fff;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input.error,
.form-group select.error {
  border-color: #f44336;
}

.error-message {
  display: block;
  color: #f44336;
  font-size: 14px;
  margin-top: 5px;
}

.radio-group {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border: 2px solid #444;
  border-radius: 6px;
  transition: all 0.3s;
}

.radio-label:hover {
  border-color: #667eea;
}

.radio-label input[type="radio"] {
  margin-right: 8px;
  cursor: pointer;
}

.radio-label span {
  color: #e0e0e0;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-success {
  background: #4caf50;
  color: white;
  flex: 1;
}

.btn-success:hover {
  background: #45a049;
}

.btn-secondary {
  background: #666;
  color: white;
  flex: 1;
}

.btn-secondary:hover {
  background: #555;
}

.btn-edit {
  background: #2196f3;
  color: white;
  padding: 8px 12px;
  font-size: 14px;
}

.btn-edit:hover {
  background: #1976d2;
}

.btn-delete {
  background: #f44336;
  color: white;
  padding: 8px 12px;
  font-size: 14px;
}

.btn-delete:hover {
  background: #d32f2f;
}

.table-container {
  background: #2c2c2c;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.table-container h2 {
  margin-top: 0;
  color: #667eea;
}

.table-responsive {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

thead {
  background: #667eea;
  color: white;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #444;
}

th {
  font-weight: 600;
}

tbody tr {
  transition: background-color 0.3s;
}

tbody tr:hover {
  background: #3a3a3a;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: #2c2c2c;
  border-radius: 10px;
  color: #999;
  font-size: 18px;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  header h1 {
    font-size: 1.8em;
  }

  .form-container,
  .table-container {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .radio-group {
    flex-direction: column;
    gap: 10px;
  }

  table {
    font-size: 14px;
  }

  th, td {
    padding: 8px;
  }

  .actions-cell {
    flex-direction: column;
  }
}
</style>