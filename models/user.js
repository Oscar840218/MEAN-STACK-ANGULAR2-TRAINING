const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    username: { type: String, required: true, unique: true, lowercase: true},
    password: { type: String, required: true }
});

let UsernameLengthChecker = (username) => {
    if (!username) {
        return false;
    } else {
        if (username.length < 3 || user.length > 15) {
            return false;
        } else {
            return true;
        }
    }
};

let validUsername = (username) => {
     if (!username) {
        return false;
    } else {
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
};

const UserNameValidators = [
    {
        validator: UsernameLengthChecker,
        message: 'Username must be at least 3 characters but no more than 15'
    },
     {
        validator: validUsername,
        message: 'Username must do have special characters'
    },
];


userSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    } else {
        bcrypt.hash(this.password, null, null, (err,hash) => {
            if (err) return next(err);
            this.password = hash;
            next();
        });
    }
});

userSchema.methods.comparePassword = (password) => {
    return bcrypt.compareSync(password, this.password);
}


module.exports = mongoose.model('User', userSchema);