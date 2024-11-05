
# Reparamos 🔧✨

Una aplicación de Node.js para manejar peticiones de reparación y venta de productos tecnológicos. Parte de un proyecto estudiantil

![App Demo](https://media.tenor.com/_Y_yYk7yMoMAAAAi/reparing-cogwheel.gif)  
<small>*(Puede que no se vea)*</small>

---

## Características 🌟

- **Autenticación de Usuarios**: Powered by Passport.js
- **Routing Dinámico**: Rutas/Endpoints organizados
- **Integración de MySQL**: Uso eficiente y seguro de datos
- **Interfaz Simple y Bonita**: Diseñado para ser minimalista y agradable a la vista

## Instalación 🛠️

```bash
git clone https://github.com/arequipeTaffy/reparamos.git
cd reparamos
npm install
```

## Uso 🚀

1. **Comenzar el Server**:
   ```bash
   npm run dev
   ```
2. **Ve a** `http://localhost:[puerto]`, o usar aplicativos como **Postman** o **cURL** para testear endpoints

<small>(Tu `puerto` deberá estar en el archivo `.env`, o por defecto será **8080**)</small>

### ***Importante!!!***

+ Recuerda configurar tu archivo `.env` con las variables de entorno correctas. También puedes hardcodear directamente las variables de entorno en los archivos que las requieran.

+ Para las rutas con `checkAuth` middleware, recuerda hacer las peticiones HTTP con una cookie si estás usando **Postman** o **cURL** 🍪🍪🍪

```bash
curl -c jarfile -d "email=admin@a.com&password=admin" http://localhost:8899/login 

curl -b jarfile localhost:8899/users | cat -l json
```


## Estructura 📂

- `app.js`: Lógica del server 🧠
- `routes/`: Rutas principales 🧭
- `views/`: Plantillas EJS para frontend ✨
- `passport-config.js`: Configuración de passport.js para autenticación 💾
- `dbF.js`: Funciones Y Queries ⚙️

## 👀

[Mini Guía](https://youtu.be/1mRmCwn3icw)
![App Preview](https://media.tenor.com/mJBBwXAZyTwAAAAi/repair-mechanics.gif)

---

## El Squad 🤝 💻

### Backend 📡 </>
- **arequipeTaffy <small>*(a.k.a el del repo)</small>***
- **samuelmusico100**

### Frontend 🌐 📱
- **El Mono**
- **Jesús Gonzáles**

---
