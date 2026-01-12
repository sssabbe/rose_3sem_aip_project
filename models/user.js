// models/user.js
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  hashedPassword: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    default: 'user' // 'user' или 'admin'
  }
});

// Метод для проверки пароля
userSchema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.hashedPassword);
}

// Виртуальное поле для удобства
userSchema.virtual('password')
  .set(function(password) {
    this._plainPassword = password;
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._plainPassword;
  });

// Метод для шифрования пароля
userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, 10); // 10 - salt rounds
};

// Middleware перед сохранением
userSchema.pre('save', function(next) {
  if (this.isModified('hashedPassword')) {
    console.log('Пароль изменен для пользователя:', this.username);
  }
  next();
});

var User = mongoose.model('User', userSchema);
exports.User = User;