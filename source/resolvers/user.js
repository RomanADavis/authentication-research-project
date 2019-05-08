import Joi from 'joi'
import mongoose from 'mongoose'
import { UserInputError } from 'apollo-server-express'
import { signUp, signIn } from '../validators'
import { User } from '../schemata'
import * as Authentication from '../authentication'

export default {
  Query: {
    me: (root, args, { request }, info) => {
      Authentication.checkSignedIn(request)

      return User.findbyId(request.session.userId)
    },

    users: (root, args, { request }, info) => {
      Authentication.checkSignedIn(request)
      User.find({})
    },

    user: (root, args, { request }, info) => {
      const { id } = args

      Authentication.checkSignedIn(request)

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError(`${id} is not a valid user ID.`)
      }

      return User.findById(id)
    }
  },

  Mutation: {
    signUp: async (root, args, { request }, info) => {
      Authentication.checkSignedOut(request)
      await Joi.validate(args, signUp, { abortEarly: false })
      return User.create(args)
    },

    signIn: async (root, args, { request }, info) => {
      const { userId } = request.session

      if (userId) return User.findById(userId)

      await Joi.validate(args, signIn, { abortEarly: false })

      const user = await Authentication.attemptSignIn(args)

      request.session.userId = user.id

      return user
    },

    signOut: async (root, args, { request, response }, info) => {
      Authentication.checkSignedIn(request)

      return Authentication.signOut(request, response)
    }
  }
}
