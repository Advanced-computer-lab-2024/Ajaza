const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bcrypt = require('bcryptjs');


const sellerSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true

    },
    id: {
        type: String,
        required: true
    },
    taxationRegCard: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    desc: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    acceptedTerms: {
        type: Boolean,
        default: false,
        required: true
    },
    notifications: {
        type: [{
            text: {
                type: String,
                required: true
            },
            seen: {
                type: Boolean,
                default: false
            },
            productId: {
                type: Number,
                required: true
            }
        }],
        default: []
    }

})


// Pre-save middleware to hash the password before saving it to the database
sellerSchema.pre('save', async function(next) { //pre is a method that runs before the save method is called
    const seller = this; //this refers to the document being saved

    if (!seller.isModified('pass')) { //isModified is a method that checks if the password has been modified by comparing it to the original password in the database
        return next(); //if the password has not been modified, the function moves on to the next middleware which is the save method without rehashing the password
    }

    try {
        const salt = await bcrypt.genSalt(10); //genSalt is a method that generates a salt for the password (salt is a random string that is used to hash the password and 10 is the number of rounds to generate the salt)
        const hash = await bcrypt.hash(seller.pass, salt);  //hash is a method that hashes the password using the salt generated
        seller.pass = hash; //the password in the document is replaced with the hashed password
        next(); //the function moves on to the next middleware which is the save method
    } catch (err) {
        next(err);
    }
});

// Method to compare plain text password with hashed password 
//(used in the login route to compare the password entered by the user with the hashed password in the database) 
sellerSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.pass); 
    } catch (err) {
        throw new Error(err);
    }
};









module.exports = mongoose.model('Seller', sellerSchema)  //Seller is the model name and sellerSchema is the schema we created passed as a parameter to the model method

// Seller.find() //finds all the workouts in the Seller collection