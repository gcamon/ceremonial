const router = require('express').Router()
const Transaction = require('../models/Transaction')
const User = require('../models/User')
const verifyToken = require('../verifyTokens')

//CREATE
router.post("/", async (req,res) => { 
    const newTransaction = new Transaction(req.body);
    const user = await User.findById(req.body.user);
    try {
       const saveTransaction = await newTransaction.save();
       if(user){
           user.isServiceWorthy = true;
           user.transactions.unshift(req.body.user)
           const saveUser = await user.save();
           res.status(200).json({status: "success",isServiceWorthy: true});
       } else {
          res.status(200).json(saveTransaction);
       }
      
    } catch(err) {
        res.status(500).json(err)
    }
});

//UPDATE
router.put("/:id", verifyToken, async (req,res) => {
    if(req.user?.isAdmin){
      try {
         const updateTransaction = await Transaction.findByIdAndUpdate(req.params.id,{
             $set: req.body,
         },{
             new: true,
         });
         res.status(200).json(updateTransaction);
      } catch(err) {
          res.status(500).json(err)
      }
    } else {
        res.status(403).json("Permission denied!")
    }
})
  
//DELETE
router.delete("/:id", verifyToken, async (req,res) => {
    if(req.user?.isAdmin){
      try {
            await Transaction.findByIdAndDelete(req.params.id);
            res.status(200).json("Transanction has been deleted!")
      } catch(err) {
          res.status(500).json(err)
      }
    } else {
        res.status(403).json("Permission denied!")
    }
})

//GET
router.get("/find/:id", verifyToken, async (req,res) => { 
    try {
        const transaction = await Transaction.findById(req.params.id)     
        res.status(200).json(transaction);
    } catch(err) {
        res.status(500).json(err)
    }
})

//GET RANDOM
// router.get("/random", verifyToken, async (req,res) => {   
//     const type = req.query?.type;
//     try {
//         const movie = (type === "series") ? 
//         await Movie.aggregate([
//             { $match: { isSeries: true } },
//             {$sample: { size: 1 } }
//         ]) : 
//         await Movie.aggregate([
//             { $match: { isSeries: false } },
//             { $sample: { size: 1} }
//         ]);
//         res.status(200).json(movie)
//     } catch(err) {
//         res.status(500).json(err)
//     }
// })

//GET ALL
router.get("/", verifyToken, async (req,res) => {
    if(req.user?.isAdmin){
      try {
            const transaction = await Transaction.find();
            res.status(200).json(transaction.reverse())
      } catch(err) {
          res.status(500).json(err)
      }
    } else {
        res.status(403).json("Permission denied!")
    }
})

module.exports = router;