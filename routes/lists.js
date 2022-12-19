const router = require('express').Router()
const List = require('../models/List')
const verifyToken = require('../verifyTokens')

//GET
router.get("/", verifyToken, async (req,res) => {
    const typeQuery = req.query.type
    const genreQuery = req.query.genre
    let list = []
    try{
        if(typeQuery){
            if(genreQuery){
                list = await List.aggregate([
                    {$sample: {size: 10}},
                    {$match: {type: typeQuery, genre: genreQuery}}
                ])
            } else {
                list = await List.aggregate([
                    {$sample: {size: 10}},
                    {$match: {type: typeQuery}}
                ])
            }
        } else {
            list = await List.aggregate([{$sample: {size: 10}}])
        }
        
        res.status(200).json(list)

    } catch(err) {
        console.log(err)
        res.status(500).json(err)
    }
});

//CREATE
router.post("/", verifyToken, async (req,res) => {
    if(req.user?.isAdmin){
        const newList = new List(req.body)
        try {
            const saveList = await newList.save()
            res.status(200).json(saveList)
        } catch(err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("Permission denied!")
    }
});
  
//UPDATE
router.put("/:id", verifyToken, async (req,res) => {
    if(req.user?.isAdmin){
    try {
        const updateMovie = await Movie.findByIdAndUpdate(req.params.id,{
            $set: req.body,
        },{
            new: true,
        });
        res.status(200).json(updateMovie);
    } catch(err) {
        res.status(500).json(err)
    }
    } else {
        res.status(403).json("Permission denied!")
    }
});

//DELET
router.delete("/:id", verifyToken, async (req,res) => {
    if(req.user?.isAdmin){
    try {
            await List.findByIdAndDelete(req.params.id)
            res.status(201).json("The list has been deleted!")
    } catch(err) {
        res.status(500).json(err)
    }
    } else {
        res.status(403).json("Permission denied!")
    }
});

module.exports = router;