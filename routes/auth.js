const router = require('express').Router()
const User = require('../models/User')
const CryptoJS = require("crypto-js")
const jwt = require('jsonwebtoken')
const transporter = require('../emailServices')

const random = (len) => {
    const str = "1234567890ABCDEFGHIJKLMNOPKRSTUVWXYZ";
    let token = "";

    for (var i = 0; i < len; i++) {
        token += str[Math.floor(Math.random() * str.length)]
    }

    return token;
}

const random2 = (len) => {
    const str = "1234567890ABCDEFGHIJKLMNOPKRSTUVWXYZ##))%%%%$$$!!!!&&&@@@???((";
    let token = "";

    for (var i = 0; i < len; i++) {
        token += str[Math.floor(Math.random() * str.length)]
    }
    
    return token;
}

//Register
router.post('/register', async (req,res) => {
    const newUser = new User(req.body);
    newUser.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString();
    newUser.username = req.body.email.split('@')[0] + Math.floor(Math.random() * 9999);
    try {
        const user = await newUser.save()
        res.status(201).json(user);
    } catch(err) {
        if (err) {
            if (err.name === 'MongoServerError' && err.code === 11000) {
              const {phone, email, regNum} = err.keyValue
              const field = phone || email || regNum
              return res.status(422).send({ success: false, message: `User with ${field} already exist!` });
            }
      
            // Some other error
            return res.status(422).send(err);
        }
        return res.status(500).json(err)
    }
});

//LOGIN
router.post('/login',async (req,res) => {
    try {          
        const type = req.body.username.indexOf("@")   
        const searchParam = (type !== -1) ? { email: req.body.username } : {regNum: req.body.username}
        const { email, regNum } = searchParam;
        const user = await User.findOne(searchParam)
        if(!user) return res.status(401).json(`Wrong user ${email && "email" || regNum && 'Reg number'}!`)

        const bytes  = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY)
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

        if(originalPassword !== req.body.password) return res.status(401).json("Wrong user password!")
        
        const accessToken = jwt.sign(
            {id: user._id, isAdmin: user.isAdmin}, 
            process.env.JWT_SECRET_KEY,{expiresIn: "5d"})

        const { password, transactions, token, ...info } = user._doc

        return res.status(201).json({ ...info, accessToken })

    } catch (err) {
        return res.status(500).json(err)
    }
});

router.post('/verifyUser', async (req,res) => {
    try {
        const user = (req.body.username.indexOf("@") !== -1) ?  
        await User.findOne({email: req.body.username}) 
        : await User.findOne({regNum: req.body.username});

        if(user){
            user.token = random(7);
            const saveUser = await user.save();
            const options = {
                from: 'gcamon29@outlook.com',
                to: user.email, 
                subject: `ESUT Ceremonial Account Verification`,
                html: `<div><h2>Welcome To ESUT Ceremonial Social Platform</h2><br/>
                <p>Here is your account verification token</p><br/> <h3>${user.token}</h3> </div>`
            }
        
            transporter.sendMail(options,(err,info) => {
                if(err) throw err;
                //console.log(info.response)
            })

            return res.status(200).json({
                status: true, 
                message: "We have sent a reset token to your email. Please enter the token below."
            })
            // send otp email to user to verify account
        } else {
            return res.status(422).json("User does not exist.")
        }        

    } catch(err) {
        return res.status(500).json(err)
    }
   
});

router.post('/verifyToken',async (req,res) => {
    try {
        let user = (req.body.username.indexOf("@") === -1) 
        ? await User.findOne({phone: req.body.username})
        : await User.findOne({email: req.body.username})        
        if(user){
            if(user.token === req.body.token && req.body.token?.length <= 10){
                user.token = random2(25);
                const saveUser = await user.save();
                return res.status(200).json({status: true})
            } else {
                return res.status(406).json("Token invalid")
            }
        } else {
            return res.status(406).json("User not found")
        }
    } catch(err) {
        return res.status(500).json(err)
    }
})

router.put("/verifyToken", async (req,res) => {
    try {
        let user = (req.body.username.indexOf("@") === -1) 
        ? await User.findOne({phone: req.body.username})
        : await User.findOne({email: req.body.username})
        if(user){
            user.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(); 
            const saveUser = await user.save();
            return res.status(200).json({status: true})
        } else {
            return res.status(406).json("User not found")
        }
       
    } catch(err) {
        res.status(500).json(err)
    }
})

//UPDATE USER
router.put('/register/:id', async (req,res) => {    
    try {
        const user = await User.findByIdAndUpdate(req.params.id,{
            $set : {
                profilePic: req.body.profilePic
            }      
        });
        const saveUser = await user.save();
        return res.status(201).json(saveUser);
    } catch(err) {
        return res.status(500).json(err);
    }
});

module.exports = router;