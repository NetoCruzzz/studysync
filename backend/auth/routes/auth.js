const router = require('express').Router();


router.post('/register', (re1, res) =>{
    res.send('Register');
});

const existingUser = await User.findOne({
    if (exisitingUser) {
        return res.status((400).json({ error: 'Username already exists.'}))
    }
})


module.exports = router;