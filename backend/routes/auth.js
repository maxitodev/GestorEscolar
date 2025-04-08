const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const usuarioModel = require('../models/usuario');

// Registro
router.post('/register', async (req, res) => {
  const { nombre, correo, contrasena, rol } = req.body;
  const hashedPassword = await bcrypt.hash(contrasena, 10);

  usuarioModel.crearUsuario({ nombre, correo, contrasena: hashedPassword, rol, carrera_FK: req.body.carrera_FK }, (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json({ message: 'Usuario registrado correctamente' });
  });
});

// Login
router.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  usuarioModel.getUsuarioPorCorreo(correo, async (err, usuario) => {
    if (err || !usuario) return res.status(401).json({ error: 'Credenciales inválidas' });

    const match = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol,
      },
    });
  });
});

module.exports = router;
