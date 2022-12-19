const router = require('express').Router()
const User = require('../models/User')
const CryptoJS = require("crypto-js")
const verifyToken = require('../verifyTokens')

//UPDATE
router.put("/:id", verifyToken, async (req,res) => {
  if(req.user?.id === req.params.id || req.user?.isAdmin){
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
    }
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new: true});
        res.status(201).json(updateUser)
    } catch(err) {
        res.status(500).json(err)
    }
  } else {
      res.status(403).json("Permission denied!")
  }
})

//DELETE
router.delete("/:id", verifyToken, async (req,res) => {
    if(req.user?.id === req.params.id || req.user?.isAdmin){
      try {
            await User.findByIdAndDelete(req.params.id);
            res.status(201).json("User has been deleted!")
      } catch(err) {
          res.status(500).json(err)
      }
    } else {
        res.status(403).json("Permission denied!")
    }
})

//GET USER STATS 
router.get("/stats",verifyToken, async (req,res) => {
    const today = new Date();
    const lastYear = today.setFullYear(today.setFullYear() - 1);
    const monthsArray = [
        "January",
        "Fabruary",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    try {
        const data = await User.aggregate([
            {
                $project: {
                    month: {$month: "$createdAt"}
                }
            },
            {               
                $group: {
                    _id: "$month",
                    total: {$sum: 1}
                }
            }
            
        ])
        res.status(200).json(data);
    } catch(err) {
        res.status(500).json(err);
    }

})

//GET
router.get("/:id", verifyToken, async (req,res) => { 
    try {
        const user = await User.findById(req.params.id);
        const { password, ...info } = user._doc;
        res.status(201).json(info)
    } catch(err) {
        res.status(500).json(err)
    }
})

//GET All
router.get("/", verifyToken, async (req,res) => {   
    const query = req.query.new;
    if(req.user.isAdmin){
        try {
            const users = query 
            ? await User.find().sort({_id: -1}).limit(5) 
            : await User.find();
            res.status(201).json(users)
        } catch(err) {
            res.status(500).json(err)
        }
    }  else {
        res.status(403).json("You are not allowed to see all users")
    }
   
})





module.exports = router;