const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

//FOR LATER, tokenList has to be replaced with DB
const tokenList = {};
const router = express.Router();

router.get('/status', (req, res, next) => {
    res.status(200);
    res.json({'status': 'ok'});
});
router.post('/signup', passport.authenticate('signup', {session: false}), async (req, res, next) => {
    res.status(200).json({message: 'signup successful'});
});

router.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err || !user) {
                const error = new Error('An error occured');
                return next(error);
            }
            req.login(user, {session: false}, async (error) => {
                if (error) {
                    return next(error);
                }
                const body = {
                    _id: user.User_id,
                    email: user.Email
                };

                const token = jwt.sign({user: body}, process.env.JWT_PW, {expiresIn: 300});
                const refreshToken = jwt.sign({user: body}, process.env.REF_JWT_PW, {expiresIn: 86400});

                res.cookie('jwt', token);
                res.cookie('refreshJwt', refreshToken);

                tokenList[refreshToken] = {
                    token,
                    refreshToken,
                    email: user.Email,
                    _id: user.User_id
                };
                let id = user.User_id;
                let username = user.Username;

                res.status(200).json({token, refreshToken, id, username});
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

router.post('/token', (req, res) => {
    const {refreshToken} = req.body;

    if ((refreshToken in tokenList)) {
        const body = { email: tokenList[refreshToken].email, _id: tokenList[refreshToken]._id };
        const token = jwt.sign({ user: body }, process.env.JWT_PW, { expiresIn: 300 });
        // update jwt
        res.cookie('jwt', token);
        tokenList[refreshToken].token = token;
        res.status(200).json({ token });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

router.post('/logout', (req, res) => {
    if (req.cookies) {
        const refreshToken = req.cookies['refreshJwt'];
        if (refreshToken in tokenList) delete tokenList[refreshToken]
        res.clearCookie('refreshJwt');
        res.clearCookie('jwt');
    }
    res.status(200).json({ message: 'logged out' });
});

module.exports = router;
