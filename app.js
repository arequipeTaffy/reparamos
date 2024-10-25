import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { router } from './routes/root.js'
import { rUsuario,
        crearUsuario,
        login,
        listarUsuarios,
        eliminarUsuario,
        cambiarContraseña } from './dbF.js';

dotenv.config();

const __dirname = import.meta.dirname;
const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded( { extended : false } ));

app.use(router);

app.get('/user/:id', async (req, res) => {
    const id = req.params.id;
    const ip = req.ip;
    console.log(`${ip} sent a request`);
    const user = await rUsuario(id);
    //res.send(user);
    res.type('text').send(user);
})

app.get('/users', async (req, res) => {
    console.log('Someone tried to get users');
    const users = await listarUsuarios();
    console.log(users);
    res.type('text').send(users);
})

app.post('/post', (req, res) => {
    console.log(req.body.mes);
    res.send(`you uploaded ${req.body.mes}`);
});


app.post('/cuser', async (req, res) => {
    try {
            const { name, password, email } = req.body;
            const info = await crearUsuario(name, password, email)
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

app.post('/login', async (req, res) => {
    const { password, email } = req.body;
    const info = await login(email, password);
    console.log('Alguien se ha registrado.')
    res.send(info);
})

app.put('/upassword', async (req, res) => {
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

app.delete('/duser', async (req, res) => {
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

app.listen(PORT, () =>{
    console.log(`Servidor corriendo en el puerto ${PORT}, en ${__dirname}`)
})