import React, { useState } from 'react';
import './App.css';

function App() {
  const [personas, setPersonas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    genero: '',
    ciudad: ''
  });
  const [errores, setErrores] = useState({});

  const ciudades = [
    'Quito',
    'Guayaquil',
    'Cuenca',
    'Ambato',
    'Manta',
    'Loja',
    'Riobamba',
    'Machala',
    'Ibarra',
    'Latacunga'
  ];

  const validarCampos = () => {
    const nuevosErrores = {};

    if (!formData.dni.trim()) {
      nuevosErrores.dni = 'El DNI es requerido';
    } else if (!/^\d{10}$/.test(formData.dni)) {
      nuevosErrores.dni = 'El DNI debe tener 10 dígitos';
    } else if (personas.some(p => p.dni === formData.dni && p.id !== editingId)) {
      nuevosErrores.dni = 'El DNI ya existe';
    }

    if (!formData.nombres.trim()) {
      nuevosErrores.nombres = 'Los nombres son requeridos';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombres)) {
      nuevosErrores.nombres = 'Los nombres solo deben contener letras';
    }

    if (!formData.apellidos.trim()) {
      nuevosErrores.apellidos = 'Los apellidos son requeridos';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.apellidos)) {
      nuevosErrores.apellidos = 'Los apellidos solo deben contener letras';
    }

    if (!formData.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = 'La fecha de nacimiento es requerida';
    } else {
      const fecha = new Date(formData.fechaNacimiento);
      const hoy = new Date();
      if (fecha > hoy) {
        nuevosErrores.fechaNacimiento = 'La fecha no puede ser futura';
      }
    }

    if (!formData.genero) {
      nuevosErrores.genero = 'El género es requerido';
    }

    if (!formData.ciudad) {
      nuevosErrores.ciudad = 'La ciudad es requerida';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarCampos()) return;

    if (editingId) {
      setPersonas(personas.map(p =>
        p.id === editingId
          ? { ...formData, id: editingId }
          : p
      ));
      setEditingId(null);
    } else {
      const nuevoRegistro = {
        ...formData,
        id: Date.now()
      };
      setPersonas([...personas, nuevoRegistro]);
    }

    setFormData({
      dni: '',
      nombres: '',
      apellidos: '',
      fechaNacimiento: '',
      genero: '',
      ciudad: ''
    });
  };

  const handleEditar = (persona) => {
    setFormData(persona);
    setEditingId(persona.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      setPersonas(personas.filter(p => p.id !== id));
    }
  };

  const handleCancelar = () => {
    setFormData({
      dni: '',
      nombres: '',
      apellidos: '',
      fechaNacimiento: '',
      genero: '',
      ciudad: ''
    });
    setEditingId(null);
    setErrores({});
  };

  return (
    <div className="app-container">
      <div className="app-content">
        <div className="header">
          <h1>Gestión de Personas</h1>
          <p>Formulario completo con validaciones y CRUD</p>
        </div>

        <div className="container">
          {/* Formulario */}
          <div className="form-section">
            <form onSubmit={handleSubmit} className="form-card">
              <h2>{editingId ? 'Editar Persona' : 'Nuevo Registro'}</h2>

              {/* DNI */}
              <div className="form-group">
                <label>DNI *</label>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  placeholder="1234567890"
                  className={errores.dni ? 'input-error' : ''}
                />
                {errores.dni && <span className="error">{errores.dni}</span>}
              </div>

              {/* Nombres */}
              <div className="form-group">
                <label>Nombres *</label>
                <input
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  placeholder="Juan Carlos"
                  className={errores.nombres ? 'input-error' : ''}
                />
                {errores.nombres && <span className="error">{errores.nombres}</span>}
              </div>

              {/* Apellidos */}
              <div className="form-group">
                <label>Apellidos *</label>
                <input
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  placeholder="García López"
                  className={errores.apellidos ? 'input-error' : ''}
                />
                {errores.apellidos && <span className="error">{errores.apellidos}</span>}
              </div>

              {/* Fecha de Nacimiento */}
              <div className="form-group">
                <label>Fecha de Nacimiento *</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className={errores.fechaNacimiento ? 'input-error' : ''}
                />
                {errores.fechaNacimiento && (
                  <span className="error">{errores.fechaNacimiento}</span>
                )}
              </div>

              {/* Género */}
              <div className="form-group">
                <label>Género *</label>
                <div className="radio-group">
                  <div className="radio-item">
                    <input
                      type="radio"
                      id="masculino"
                      name="genero"
                      value="Masculino"
                      checked={formData.genero === 'Masculino'}
                      onChange={handleChange}
                    />
                    <label htmlFor="masculino">Masculino</label>
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      id="femenino"
                      name="genero"
                      value="Femenino"
                      checked={formData.genero === 'Femenino'}
                      onChange={handleChange}
                    />
                    <label htmlFor="femenino">Femenino</label>
                  </div>
                </div>
                {errores.genero && <span className="error">{errores.genero}</span>}
              </div>

              {/* Ciudad */}
              <div className="form-group">
                <label>Ciudad *</label>
                <select
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  className={errores.ciudad ? 'input-error' : ''}
                >
                  <option value="">Seleccione una ciudad</option>
                  {ciudades.map(ciudad => (
                    <option key={ciudad} value={ciudad}>
                      {ciudad}
                    </option>
                  ))}
                </select>
                {errores.ciudad && <span className="error">{errores.ciudad}</span>}
              </div>

              {/* Botones */}
              <div className="button-group">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Actualizar' : 'Guardar'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelar}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Tabla de Registros */}
          <div className="table-section">
            <div className="table-card">
              <h2>Registros ({personas.length})</h2>

              {personas.length === 0 ? (
                <div className="empty-state">
                  <p>No hay registros aún. ¡Crea el primero!</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>DNI</th>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>F. Nacimiento</th>
                        <th>Género</th>
                        <th>Ciudad</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {personas.map(persona => (
                        <tr key={persona.id}>
                          <td>{persona.dni}</td>
                          <td>{persona.nombres}</td>
                          <td>{persona.apellidos}</td>
                          <td>{new Date(persona.fechaNacimiento).toLocaleDateString('es-ES')}</td>
                          <td>{persona.genero}</td>
                          <td>{persona.ciudad}</td>
                          <td>
                            <div className="actions">
                              <button
                                onClick={() => handleEditar(persona)}
                                className="btn-action btn-edit"
                                title="Editar"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleEliminar(persona.id)}
                                className="btn-action btn-delete"
                                title="Eliminar"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;