const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a property title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    propertyType: {
        type: String,
        required: [true, 'Please add a property type'],
    },
    location: {
        address: {
            type: String,
            required: [true, 'Please add an address']
        },
        city: {
            type: String,
            required: [true, 'Please add a city']
        },
        state: String,
        zipCode: String,
        country: {
            type: String,
            default: 'USA'
        }
    },
    bedrooms: {
        type: Number,
        required: [true, 'Please add number of bedrooms']
    },
    bathrooms: {
        type: Number,
        required: [true, 'Please add number of bathrooms']
    },
    sqft: {
        type: Number,
        required: [true, 'Please add square footage']
    },
    yearBuilt: Number,
    images: [{
        type: String
    }],
    amenities: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['active', 'pending', 'sold', 'inactive'],
        default: 'active'
    },
    featured: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    },
    seller: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for search optimization
PropertySchema.index({ 'location.city': 1, price: 1, propertyType: 1 });

module.exports = mongoose.model('Property', PropertySchema);
