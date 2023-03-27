const mongoose = require('mongoose');


const talentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        default: '',
    },
    height:{
        type: Number,
        default: '',
    },
    bust: {
        type: Number,
        default: '',
    },
    chest: {
        type: Number,
        default: '',
    },
    waist: {
        type: Number,
        default: '',
    },
    hips: {
        type: Number,
        default: '',
    },
    dress: {
        type: Number,
        default: '',
    },
    shoe: {
        type: Number,
        default: '',
    },
    hair: {
        type: String,
        required: '',
    },
    eyes: {
        type: String,
        default: '',
    },
    image:{
        type: String,
        default: '',
    },
    images:[{
        type: String,
    }]
})

talentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

talentSchema.set('toJSON', {
    virtuals: true,
});

exports.Talent = mongoose.model('Talent', talentSchema);