const {Event} = require('../models/event');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const multer = require('multer');

router.get(`/`, async (req, res) =>{
    const eventList = await Event.find();

    if(!eventList) {
        res.status(500).json({success: false})
    } 
    res.send(eventList);
})

router.post('/', async (req,res)=>{ 
    let event = new Event({        
        title: req.body.title,
        start: req.body.start,
        end: req.body.end,
        allDay: req.body.allDay,
        modelsScheduled: req.body.modelsScheduled
    })
    event = await event.save();

    if(!event)
    return res.status(400).send('the event cannot be created!')

    res.send(event);
})

router.delete('/:id', (req, res)=>{
    Event.findByIdAndRemove(req.params.id).then(event =>{
        if(event) {
            return res.status(200).json({success: true, message: 'the event is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "event not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

module.exports = router;