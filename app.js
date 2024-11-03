//Imports
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import flash from 'express-flash';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { router } from './routes/root.js';
import { rUsuario,
        crearUsuario,
        listarUsuarios,
        eliminarUsuario,
        cambiarContraseña,
        gUserEmail,
        cUserWithPrivileges, 
        creaProducto} from './dbF.js';

import methodOverride from 'method-override';
import { checkAuth,
        checkNotAuth,
        setUser } from './middleware.js';
import passport from 'passport';
import { initialize } from './passport-config.js';

//Setting a few environment variables    
initialize(passport,
    email => { return gUserEmail(email); },
    id => { return rUsuario(id); });

dotenv.config();

const __dirname = import.meta.dirname;
const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded( { extended : false } ));
app.use(cookieParser());

//Passport configuration
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false
    }}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.use(setUser);

//Multer Config
// Storage configuration for avatars
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, 'public/uploads'));
    },
    filename: function (req, file, cb) {
      cb(null, `product-${Date.now()}${path.extname(file.originalname)}`);
    }
  })
  
  const upload = multer({ storage });

//          Routes

//Main web routes
app.use(router);

//Get user by id
app.get('/user/:id', checkAuth, async (req, res) => {
    const id = req.params.id;
    console.log(`${req.ip} sent a request`);
    const user = await rUsuario(id);
    res.type('text').send(user);
})

//Get all users
app.get('/users', checkAuth, async (req, res) => {
    console.log(`Someone with the Cookie: ${JSON.stringify(req.cookies)} tried to get users`);
    const users = await listarUsuarios();
    console.log(users);
    res.type('text').send(users);
})

//Create user as admin
app.post('/api/userwith', async (req, res) => {
    try {
        const { name, password, email, secret } = req.body;
        if (secret != 'arequipe123') {
            return res.send('no\n');
        }
        const info = await cUserWithPrivileges(name, password, email);
        console.log(`Nuevo Registro:\n${JSON.stringify(info)}\nFrom ${req.ip}`);
        if (req.accepts('html')) {
            res.render('registroexitoso.ejs');
        } else {
            res.send(info);
        }
    } catch (e) {
        console.log(e);
    }
})

//Create an user
app.post('/cuser', checkNotAuth, async (req, res) => {
    try {
        const { name, password, email } = req.body;
        const info = await crearUsuario(name, password, email);
        console.log(`Nuevo Registro:\n${JSON.stringify(info)}\nFrom ${req.ip}`);
        if (req.accepts('html')) {
            //res.sendFile(path.join(__dirname, 'views', 'registroexitoso.ejs'));
            res.render('registroexitoso.ejs');
        } else {
            res.send(info);
        }
        
    } catch {
        res.redirect('/signin');
    }
})

//Login
app.post('/login', checkNotAuth, passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}), async (req, res) => {   
});

//Create new product
app.post ('/product', checkAuth, upload.single('image'), async (req, res) => {

    try {
        const { pname, price, description } = req.body;
        const imagePath = `/uploads/${req.file.filename}`;
        const info = await creaProducto(pname, price, description, imagePath);
        console.log(`Nuevo Producto:\n${JSON.stringify(info)}\nSubido por: ${req.ip}`);
        if (req.accepts('html')) {
            res.redirect('/productos');
            
        } else {
            res.send(info);
        }
        
    } catch (e) {
        res.redirect('/nuevoproducto');
    }
})

//Update password
app.put('/upassword', checkAuth, async (req, res) => {
    const { email, password, newPassword } = req.body;

    if(!email || !password || !newPassword) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const result = await cambiarContraseña(email, password, newPassword);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({ message: result.success });
});

//Lougout
app.delete('/logout', (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

//Delete user by id
app.delete('/duser', checkAuth, async (req, res) => {
    const id = req.body.id;

    if(!id){
        return res.status(400).json({ error: 'Inserte un ID'});
    }
    
    const result = await eliminarUsuario(id);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    
    console.log('A user was deleted');
    return res.status(200).json( { message: result.success } );   
})

// 404 Error 

app.all('*', (req, res) =>{
    res.status(404);
    if(req.accepts('html')){
        //res.sendFile(path.join(__dirname, 'views', '404.html'));
        res.render('404.ejs')
    } else if(req.accepts('json')){
        res.json({
            message : '404 - Not found'
        });
    } else{
        res.type('text').send('404');
    }
});

// Server up and Running

app.listen(PORT, () =>{
    console.log(`Servidor corriendo en el puerto ${PORT}, en ${__dirname}`)
})