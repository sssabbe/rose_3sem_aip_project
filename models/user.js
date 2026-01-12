const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'moderator']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Виртуальное поле для пароля
userSchema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.hashedPassword = bcrypt.hashSync(password, 10);
    })
    .get(function() {
        return this._plainPassword;
    });

// Метод проверки пароля
userSchema.methods.checkPassword = function(password) {
    return bcrypt.compareSync(password, this.hashedPassword);
};

// Статический метод для поиска по username или email
userSchema.statics.findByUsernameOrEmail = function(identifier) {
    return this.findOne({
        $or: [
            { username: identifier },
            { email: identifier }
        ]
    });
};

// Метод для обновления времени последнего входа
userSchema.methods.updateLastLogin = function() {
    this.lastLogin = new Date();
    return this.save();
};

// Middleware для обновления updatedAt
userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = { User };