const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const models = require('../db/db');
// handle user registration

passport.use('signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        if(!validateEmail(email)){
            throw 'Email is not valid';
        }
        let id = await randomId();
        const { name } = req.body;
        const user = await models.user.create(
            {
                User_id: id,
                Username: name,
                Register_date: getCurrentDate(),
                Encrypted_password: password,
                Email: email,
                Experience: 0,
                Pocket_money: 0,
            })
        return done(null, user);
    } catch (error) {
        done(error);
    }
}));

passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await models.user.findOne({
            where: {
                Email: email
            }
        });
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        const validate = await user.isValidPassword(password);
        if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
        }
        return done(null, user, { message: 'Logged in Successfully' });
    } catch (error) {
        return done(error);
    }
}));


passport.use(new JWTstrategy({
    secretOrKey: process.env.JWT_PW,
    jwtFromRequest: function (req) {
        let token = null;
        if (req && req.cookies) token = req.cookies['jwt'];
        return token;
    }
}, async (token, done) => {
    try {
        return done(null, token.user);
    } catch (error) {
        done(error);
    }
}));

async function randomId(){
    let id = 0;
    while(true){
        id = Math.floor(Math.random() * 10000);
        if(! await models.user.findByPk(id)){
            return id;
        }
    }
}

function getCurrentDate(){
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date+' '+time;
}

const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};