import mysql from 'mysql2';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();


const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

export async function rUsuario(id){
    const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?;`, [id]);
    if (rows.length === 0){
        return null;
    }
    return rows[0];
};

export async function gUserEmail(email) {
    const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
    if (rows.length === 0){
        return null;
    }
    return rows[0];
    
};

export async function crearUsuario(username, password, email){
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const [resultado] = await pool.query(`
    INSERT INTO users (name, password, email)
    VALUES (?, ?, ?)`, [username, hashedPassword, email]);
    const id = resultado.insertId;
    return rUsuario(id);
};

export async function cUserWithPrivileges(username, password, email) {
    const role = 'admin';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const [resultado] = await pool.query(`
        INSERT INTO users (name, password, email, role)
        VALUES (?, ?, ?, ?)`, [username, hashedPassword, email, role]);
    const id = resultado.insertId;
    return rUsuario(id);
};

export async function getProduct(id) {
    const [rows] = await pool.query(`SELECT * FROM products WHERE id = ?;`, [id]);
    if (rows.length === 0){
        return null;
    }
    return rows[0];
    
};

export async function getProducts() {
    const [rows] = await pool.query(`SELECT * FROM products;`);
    return rows;
    
}

export async function creaProducto(productName, price, description, imagePath) {
    const [resultado] = await pool.query(`INSERT INTO products (product_name, price, description, image)
        VALUES (?, ?, ?, ?)`, [productName, price, description, imagePath]
    );
    const id = resultado.insertId;
    return getProduct(id);
    
}

export async function cambiarContraseña(email, password, nPassword){
    try {
        const [rows] = await pool.query(`
        SELECT * FROM users WHERE email = ?;`, [email]);
        const id = rows.insertId;

        if(rows.length === 0){
            throw new Error('No existe usuario');
        }
        
        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if(!passwordMatch){
            throw new Error('Contraseña incorrecta');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(nPassword, saltRounds);

        await pool.query(`
        UPDATE users
        SET password = ?
        WHERE email = ?
        `, [hashedPassword, email]);

        return { success: 'Contraseña actualizada' };
        
    } catch (e) {
        return { error: e.message };
    }    
}

export async function listarUsuarios() {
    const [rows] = await pool.query(`SELECT * FROM users;`);
    return rows;
}

export async function eliminarUsuario(id) {
    try {
        const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
        if(rows.length === 0){
            throw new Error('No existe usuario');
        };

        await pool.query(`DELETE FROM users WHERE id = ?;`, [id]);
        return { success: `Usuario con id ${id} fue eliminado` };

    } catch (e) {
        return { error : e.message };
    }
    
};
