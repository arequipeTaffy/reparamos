import mysql from 'mysql2'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config();


const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();3

export async function rUsuario(id){
    const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?;`, [id]);
    if (rows.length === 0){
        return "null";
    }
    return rows[0];
}

export async function crearUsuario(username, password, email){
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const [resultado] = await pool.query(`
    INSERT INTO users (name, password, email)
    VALUES (?, ?, ?)`, [username, hashedPassword, email]);
    const id = resultado.insertId;
    return rUsuario(id);
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
        
    } catch (error) {
        return { error: error.message };
    }    
}

export async function login(email, password) {
    try {
        const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?;`, [email]);

        const id = rows.insertId;
        
        if (rows.length === 0) {
            throw new Error('No existe usuario');
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            throw new Error('Constraseña incorrecta');
        }

        return rows[0];
    } catch (error) {
        return { error: error.message };
    }
}

/*export async function login(email, password) {
    const [rows] = await pool.query(`
        SELECT * FROM users
        WHERE email = ?;`, [email]);
    
    if (rows.length === 0) return null;

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    return passwordMatch ? user : null;
}   */

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

    } catch (error) {
        return { error : error.message };
    }
    
}
