import { rUsuario } from "./dbF.js";

export function checkAuth(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    };
    
    res.redirect('/login');
};

export function checkNotAuth(req, res, next) {
    if (req.isAuthenticated()){
        return res.redirect('/');
    }

    next();
};

export async function setUser(req, res, next) {
    const userId = req.body.id;
    if (userId) {
        req.user = await rUsuario(userId);
    }
    next();
}
