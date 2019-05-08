import { AuthenticationError } from 'apollo-server-express'
import { User } from './schemata'
import { SESSION_NAME } from './config'

export const attemptSignIn = async args => {
  const { email, password } = args

  const user = await User.findOne({ email })

  if (!user) {
    throw new AuthenticationError('No user found that has that email.')
  }

  if (!await user.matchPassword(password)) {
    throw new AuthenticationError('Invalid password for that email.')
  }

  return user
}

export const signedIn = request => request.session.userID

export const checkSignedIn = request => {
  if (!signedIn(request)) {
    throw new AuthenticationError('You must be signed in.')
  }
}

export const checkSignedOut = request => {
  if (signedIn(request)) {
    throw new AuthenticationError('You are already signed in.')
  }
}

export const signOut = (request, response) => new Promise(
  (resolve, reject) => {
    request.session.destroy(error => {
      if (error) reject(error)

      response.clearCookie(SESSION_NAME)

      resolve(true)
    })
  }
)
