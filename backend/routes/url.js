const express = require('express');
const {nanoid} = require('nanoid');
const Url = require('../models/Url');
const router = express.Router();
router.post('/shorten', async(req,res) => {
    const {longUrl} = req.body;
    try{
        new URL(longUrl);
    }catch(err){
        return res.status(400).json({error:"Invalid URL"});
    }
    try{
        const existingUrl = await Url.findOne({ longUrl });
        if(existingUrl){
            return res.status(200).json({shortUrl: `http://localhost:5000/${existingUrl.shortCode}`});
        }
        let shortCode = nanoid(8);
        let codeExits = await Url.findOne({shortCode});
        while(codeExits){
            shortCode = nanoid(8);
            codeExits = await Url.findOne({shortCode});

        }
        const urlDoc = new Url({longUrl, shortCode});
        await urlDoc.save();
        return res.status(201).json({shortUrl: `http://localhost:5000/${shortCode}`});
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Server error"});
    }

});
router.get('/:shortCode',async(req,res) => {
    const {shortCode} = req.params;
    try{
        const urlDoc = await Url.findOne({shortCode});
        if(!urlDoc){
            return res.status(404).json({error:"URL not found"});
        }
        return res.redirect(302, urlDoc.longUrl);
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Server error"});
    }
});
module.exports = router;