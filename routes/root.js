import express from "express";
import path from 'path';
const __dirname = import.meta.dirname;

export const router = express.Router();

router.get('^/$|index(.html)?', (req, res) =>{
    //res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
    res.render('index.ejs');
});

router.get('/login', (req, res) => {
    //res.sendFile(path.join(__dirname, '..', 'views', 'Login.html'));
    res.render('Login.ejs')
});

router.get('/signin', (req, res) => {
    //res.sendFile(path.join(__dirname, '..', 'views', 'Registro.html'));
    res.render('Registro.ejs')
});