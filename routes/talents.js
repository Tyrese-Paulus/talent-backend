const {Talent} = require('../models/talent');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) =>{
    const talentList = await Talent.find();

    if(!talentList) {
        res.status(500).json({success: false})
    } 
    res.send(talentList);
})

router.get('/:id', async(req,res)=>{
    const talent = await Talent.findById(req.params.id);

    if(!talent) {
        res.status(500).json({message: 'The talent was not found.'})
    } 
    res.status(200).send(talent);
})

router.post('/',uploadOptions.single('image'), async (req,res)=>{ 
    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let talent = new Talent({        
        name: req.body.name,
        height: req.body.height,
        image: `${basePath}${fileName}`,
        bust: req.body.bust,
        waist: req.body.waist,
        hips: req.body.hips,
        dress: req.body.dress,
        shoe: req.body.shoe,
        hair: req.body.hair,
        eyes: req.body.eyes,
    })
    talent = await talent.save();

    if(!talent)
    return res.status(400).send('the talent cannot be created!')

    res.send(talent);
})

router.put('/:id', uploadOptions.single('image'), async (req, res)=> {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }
    const talent = await Talent.findById(req.params.id);
    if (!talent) return res.status(400).send('Invalid Product!');

    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = talent.image;
    }

    const updatedTalent = await Talent.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            height: req.body.height,
            image: imagepath,
            bust: req.body.bust,
            waist: req.body.waist,
            hips: req.body.hips,
            dress: req.body.dress,
            shoe: req.body.shoe,
            hair: req.body.hair,
            eyes: req.body.eyes,
        },
        { new: true}
    )

    if(!updatedTalent)
    return res.status(400).send('the talent cannot be created!')
    console.log(updatedTalent);
    res.send(updatedTalent);
})

router.delete('/:id', (req, res)=>{
    Talent.findByIdAndRemove(req.params.id).then(talent =>{
        if(talent) {
            return res.status(200).json({success: true, message: 'the talent is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "talent not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files) {
        files.map((file) => {
            imagesPaths.push(`${basePath}${file.filename}`);
        });
    }

    const talent = await Talent.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesPaths
        },
        { new: true }
    );

    if (!talent) return res.status(500).send('the gallery cannot be updated!');

    res.send(talent);
});

module.exports =router;