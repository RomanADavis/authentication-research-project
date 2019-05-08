import mongoose from 'mongoose'
import { hash, compare } from 'bcryptjs'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: email => User.absent({ email }),
      message: ({ value: email }) => `Email ${email} is already in use.`
    }
  },

  username: {
    type: String,
    validate: {
      validator: username => User.absent({ username }),
      message: ({ value: username }) => `Username ${username} is already in use.`
    }
  },

  name: String,
  password: String
}, {
  timestamps: true
})

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10)
  }
})

userSchema.statics.absent = function (options) {
  return this.where(options).countDocuments() === 0
}

userSchema.methods.matchesPassword = function (password) {
  return compare(password, this.password)
}

const User = mongoose.model('User', userSchema)

export default User
