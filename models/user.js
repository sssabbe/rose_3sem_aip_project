var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
        unique: true,  // ИНДЕКС ЗДЕСЬ
        required: true,
        trim: true,
        minlength: 3
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,  // ИНДЕКС ЗДЕСЬ
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    address: {
        street: String,
        city: String,
        postalCode: String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    created: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    cart: {
        items: [{
            productId: String,
            name: String,
            price: Number,
            quantity: Number,
            addedAt: {
                type: Date,
                default: Date.now
            }
        }],
        total: {
            type: Number,
            default: 0
        }
    }
});

// УДАЛИТЕ ЭТИ СТРОКИ (они создают дубликаты индексов):
// userSchema.index({ username: 1 }, { unique: true });
// userSchema.index({ email: 1 }, { unique: true });
// userSchema.index({ role: 1 });
// userSchema.index({ created: -1 });

// Виртуальное поле для пароля
userSchema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = Math.random() + "";
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._plainPassword;
    });

// Метод для шифрования пароля
userSchema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

// Метод для проверки пароля
userSchema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

// Метод для получения безопасных данных пользователя
userSchema.methods.getSafeData = function() {
    return {
        id: this._id,
        username: this.username,
        email: this.email,
        fullName: this.fullName,
        phone: this.phone,
        role: this.role,
        created: this.created,
        lastLogin: this.lastLogin,
        isActive: this.isActive
    };
};

// Метод для обновления времени последнего входа
userSchema.methods.updateLastLogin = async function() {
    this.lastLogin = new Date();
    return await this.save();
};

// Статический метод для поиска по имени пользователя или email
userSchema.statics.findByUsernameOrEmail = async function(login) {
    return await this.findOne({
        $or: [
            { username: login },
            { email: login }
        ]
    });
};

// Хук перед сохранением - проверка уникальности
userSchema.pre('save', async function(next) {
    if (this.isModified('username') || this.isModified('email')) {
        const User = mongoose.model('User');
        
        try {
            const existingUser = await User.findOne({
                $or: [
                    { username: this.username },
                    { email: this.email }
                ],
                _id: { $ne: this._id }
            });
            
            if (existingUser) {
                return next(new Error('Пользователь с таким именем или email уже существует'));
            }
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

module.exports = mongoose.model('User', userSchema);