const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.ObjectId,
        ref: 'Property',
        required: true
    },
    buyer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    visitDate: {
        type: Date,
        required: [true, 'Please add a visit date']
    },
    visitTime: {
        type: String,
        required: [true, 'Please add a visit time']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot be more than 500 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Visit', VisitSchema);
