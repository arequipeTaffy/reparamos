import { name } from "ejs";
import express from "express";
import path from 'path';
const __dirname = import.meta.dirname;

import { checkAuth,
    checkNotAuth } from './../middleware.js';

import { getProducts } from "../dbF.js";

export const router = express.Router();

router.get('^/$|index(.html)?', (req, res) =>{
    console.log(req.user);
    if (req.user) {
        console.log(req.user.name);
    };
    res.render('index.ejs', { user : req.user });
});

router.get('/login', checkNotAuth, (req, res) => {
    return res.render('Login.ejs');
});

router.get('/signin', checkNotAuth, (req, res) => {
    return res.render('Registro.ejs');
});

router.get('/nuevoproducto', checkAuth, (req, res) => {
    return res.render('subir_pro.ejs');
})

router.get('/productos', async (req, res) => {
    try {
        const products = await getProducts();
        res.render('productos.ejs', { products });
      } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).send('Error retrieving products');
      }
})