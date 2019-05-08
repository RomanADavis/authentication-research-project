import { makeExecutableSchema } from 'apollo-server-express'
import ApplicationSchema from './types'
import Resolvers from './resolvers'

export default makeExecutableSchema({
  typeDefs: ApplicationSchema,
  resolvers: Resolvers
})
