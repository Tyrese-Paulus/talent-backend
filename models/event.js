const mongoose = require('mongoose');


const eventSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    start:{
        type: String,
        required: true,
    },
    end: {
        type: String,
        required: false,
    },
    allDay: {
        type: Boolean,
        required: false,
    },
    modelsScheduled: {
        type: Array
    }
})

eventSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

eventSchema.set('toJSON', {
    virtuals: true,
});

exports.Event = mongoose.model('Event', eventSchema);