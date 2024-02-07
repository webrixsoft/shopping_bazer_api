const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// mongoose.set('debug', true);   // to print query


const adminSchema = new mongoose.Schema({
        username: {
                type: String,
                index: true,
                required: [true, 'Username Feild is required!']
        },

        name: {        // new 5 fields add
                type: String,
                default: ''
        },
        phone: {
                type: String,
                default: '',
        },

        email: {
                type: String,
                sparse: true,
                trim: true,
                default: '',
                lowercase: true,
                match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },

        password: {
                type: String,
                required: [true, 'Please provide a password'],
                minlength: 8,
                select: false
        },
        passwordConfirm: {
                type: String,
                required: [true, 'Please confirm your password'],
                validate: {
                        validator: function (el) {
                                return el === this.password;
                        },
                        message: 'Passwords are not the same!'
                }
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        active: {
                type: Boolean,
                default: true,
                select: false
        }

}, {
        timestamps: true
});

adminSchema.pre('save', async function (next) {
        // Only run this function if password was actually modified
        if (!this.isModified('password')) return next();

        // Hash the password with cost of 12
        this.password = await bcrypt.hash(this.password, 12);

        // Delete passwordConfirm field
        this.passwordConfirm = undefined;
        next();
});

adminSchema.pre('save', function (next) {
        if (!this.isModified('password') || this.isNew) return next();

        this.passwordChangedAt = Date.now() - 1000;
        next();
});

adminSchema.pre(/^find/, function (next) {
        // this points to the current query
        this.find({ active: { $ne: false } });
        next();
});

adminSchema.methods.correctPassword = async function (
        candidatePassword,
        userPassword
) {
        return await bcrypt.compare(candidatePassword, userPassword);
};

adminSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
        if (this.passwordChangedAt) {
                const changedTimestamp = parseInt(
                        this.passwordChangedAt.getTime() / 1000,
                        10
                );

                return JWTTimestamp < changedTimestamp;
        }

        // False means NOT changed
        return false;
};

adminSchema.methods.createPasswordResetToken = function () {
        const resetToken = crypto.randomBytes(32).toString('hex');

        this.passwordResetToken = crypto
                .createHash('sha256')
                .update(resetToken)
                .digest('hex');
        this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

        return resetToken;
};

const User = mongoose.model('user', adminSchema);  // define table name here eg.Admin in model function
module.exports = User;

