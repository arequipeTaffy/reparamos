import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

export async function initialize(passport, getUserByEmail, getUserByID) {
    const authUser = async (email, password, done) => {
        const user = await getUserByEmail(email);
        if (user == null) {
            return done(null, false, { message: 'No user by that Email'});
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect'});
            }
        } catch (e) {
            return done(e);
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'email'}, authUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => done(null, await getUserByID(id)));
    
}