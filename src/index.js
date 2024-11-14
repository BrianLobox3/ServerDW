'use strict';

const cors = require('cors');
const db = require('../models/index.js'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const Sequelize = require('sequelize');
const app = express();
const port = 3000;

const secretKey = '12345'; // Clave secreta para JWT

app.use(cors());
app.use(express.json());

app.get('/dataBasePing', (req, res) => {
    db.sequelize.authenticate()
        .then(() => {
            res.send('Connection has been established successfully.');
        })
        .catch((err) => {
            res.status(500).send('Unable to connect to the database: ' + err);
        });
});

app.post("/register", async (req, res) => {
    const { nombre, correo, telefono, username, password } = req.body;
    if (!nombre || !correo || !telefono || !username || !password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }
    
    try {
        const user = await db.Users.findOne({ where: { username } });
        if (user) {
            return res.status(401).json({ message: 'El nombre de usuario ya está en uso.' });
        }
        
        await db.Users.create({ 
            nombre, 
            correo, 
            telefono, 
            username, 
            plainPassword: password, 
            password                   
        });

        return res.status(201).json({ message: "Usuario creado" });
    } catch (e) {
        console.error("Error durante el registro:", e);
        return res.status(500).json({ message: "Error en el servidor" });
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db.Users.findOne({ where: { username } });

        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(password.trim(), user.password);
        console.log("Contraseña ingresada:", password.trim());
        console.log("Contraseña en la base de datos (encriptada):", user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
        res.json({ message: 'Login exitoso', token, user: { username: user.username } });

    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

  

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.get('/usuario', authenticateToken, async (req, res) => {
    try {
        const user = await db.Users.findByPk(req.user.id, {
            attributes: ['id', 'nombre', 'correo', 'telefono', 'username']
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
});

app.get('/recetas', authenticateToken, async (req, res) => { 
    const userId = req.user.id;

    try {
        const recetas = await db.Receta.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { visibility: 'public' },
                    { visibility: 'private', userId: userId }
                ]
            },
            order: [['createdAt', 'DESC']] 
        });

        res.json(recetas);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las recetas');
    }
});

app.get('/recetas/privadas', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const recetas = await db.Receta.findAll({
            where: {
                visibility: 'private',
                userId: userId
            },
            order: [['createdAt', 'DESC']]
        });

        res.json(recetas);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las recetas privadas');
    }
});

app.post("/recetas", authenticateToken, async (req, res) => {
    const { name, description, categoria, imageUrl, visibility, author } = req.body;  
    const userId = req.user.id;

    try {
        const newReceta = await db.Receta.create({
            name,
            description,
            categoria,
            imageUrl,
            visibility: visibility || 'private',  
            userId,
            author: author || '',  
        });
        return res.status(201).json({ message: "Receta creada", receta: newReceta });
    } catch (error) {
        console.error("Error creando receta:", error);
        return res.status(500).json({ message: "Error al crear la receta." });
    }
});

app.get('/receta/:id', authenticateToken, async (req, res) => { 
    const recetaId = req.params.id; 
    const userId = req.user.id;
    try {
        const receta = await db.Receta.findOne({
            where: {
                id: recetaId,
                [Sequelize.Op.or]: [
                    { visibility: 'public' },
                    { visibility: 'private', userId: userId }
                ]
            }
        });

        if (!receta) {
            return res.status(404).send('Receta no encontrada');
        }

        res.json(receta); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la receta');
    }
});

app.patch('/recetas/:id', authenticateToken, async (req, res) => {
    const recetaId = req.params.id;
    const { likes, dislikes } = req.body;

    try {
        const receta = await db.Receta.findOne({ where: { id: recetaId } });

        if (!receta) {
            return res.status(404).send('Receta no encontrada');
        }

        if (likes !== undefined) {
            receta.likes = likes;
        }
        if (dislikes !== undefined) {
            receta.dislikes = dislikes;
        }

        await receta.save(); 
        res.json(receta);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar la receta');
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});