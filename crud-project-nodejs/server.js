const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Configurar base de datos SQLite
const db = new sqlite3.Database('./usuarios.db', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
  } else {
    console.log('✅ Conectado a la base de datos SQLite');
  }
});

// Crear tabla si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dni TEXT NOT NULL UNIQUE,
    nombres TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero TEXT NOT NULL,
    ciudad TEXT NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('Error al crear tabla:', err);
  } else {
    console.log('✅ Tabla usuarios verificada/creada');
  }
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal - index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Ruta de registro - formulario.html
app.get('/registro', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'formulario.html'));
});

// ========== RUTAS CRUD ==========

// CREATE - Crear nuevo usuario
app.post('/api/usuarios', (req, res) => {
  const { dni, nombres, apellidos, fecha_nacimiento, genero, ciudad } = req.body;

  // Validaciones del servidor
  if (!dni || !nombres || !apellidos || !fecha_nacimiento || !genero || !ciudad) {
    return res.status(400).json({ 
      error: 'Todos los campos son obligatorios' 
    });
  }

  // Validar formato DNI (10 dígitos para Ecuador)
  if (!/^\d{10}$/.test(dni)) {
    return res.status(400).json({ 
      error: 'El DNI debe contener exactamente 10 dígitos' 
    });
  }

  // Validar nombres y apellidos (solo letras)
  if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(nombres) || !/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(apellidos)) {
    return res.status(400).json({ 
      error: 'Nombres y apellidos solo pueden contener letras' 
    });
  }

  const query = `INSERT INTO usuarios (dni, nombres, apellidos, fecha_nacimiento, genero, ciudad) 
                 VALUES (?, ?, ?, ?, ?, ?)`;

  db.run(query, [dni, nombres, apellidos, fecha_nacimiento, genero, ciudad], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ 
          error: 'El DNI ya está registrado' 
        });
      }
      return res.status(500).json({ 
        error: 'Error al registrar usuario: ' + err.message 
      });
    }
    
    res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      id: this.lastID 
    });
  });
});

// READ - Obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
  const query = 'SELECT * FROM usuarios ORDER BY fecha_registro DESC';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Error al obtener usuarios: ' + err.message 
      });
    }
    res.json(rows);
  });
});

// READ - Obtener un usuario por ID
app.get('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM usuarios WHERE id = ?';
  
  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Error al obtener usuario: ' + err.message 
      });
    }
    if (!row) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    res.json(row);
  });
});

// UPDATE - Actualizar usuario
app.put('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { dni, nombres, apellidos, fecha_nacimiento, genero, ciudad } = req.body;

  // Validaciones
  if (!dni || !nombres || !apellidos || !fecha_nacimiento || !genero || !ciudad) {
    return res.status(400).json({ 
      error: 'Todos los campos son obligatorios' 
    });
  }

  if (!/^\d{10}$/.test(dni)) {
    return res.status(400).json({ 
      error: 'El DNI debe contener exactamente 10 dígitos' 
    });
  }

  const query = `UPDATE usuarios 
                 SET dni = ?, nombres = ?, apellidos = ?, fecha_nacimiento = ?, genero = ?, ciudad = ?
                 WHERE id = ?`;

  db.run(query, [dni, nombres, apellidos, fecha_nacimiento, genero, ciudad, id], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ 
          error: 'El DNI ya está registrado por otro usuario' 
        });
      }
      return res.status(500).json({ 
        error: 'Error al actualizar usuario: ' + err.message 
      });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    res.json({ 
      message: 'Usuario actualizado exitosamente' 
    });
  });
});

// DELETE - Eliminar usuario
app.delete('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM usuarios WHERE id = ?';
  
  db.run(query, [id], function(err) {
    if (err) {
      return res.status(500).json({ 
        error: 'Error al eliminar usuario: ' + err.message 
      });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    res.json({ 
      message: 'Usuario eliminado exitosamente' 
    });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Cerrar base de datos al terminar
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error al cerrar base de datos:', err);
    } else {
      console.log('Base de datos cerrada');
    }
    process.exit(0);
  });
});