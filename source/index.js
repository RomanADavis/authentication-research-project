import { ApolloServer } from 'apollo-server-express'
import session from 'express-session'
import connectRedis from 'connect-redis'
import express from 'express'
import mongoose from 'mongoose'
import Schema from './schema'
import { User } from './schemata'
import { PORT, IN_PRODUCTION, USERNAME, PASSWORD,
  SESSION_NAME, SESSION_SECRET, SESSION_LIFETIME,
  REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from './config'

(async () => {
  try {
    await mongoose.connect(`mongodb+srv://${USERNAME}:${PASSWORD}@chat-fod2a.mongodb.net/test?retryWrites=true`
    ) // no port?

    const app = express()

    app.disable('x-powered-by')

    const RedisStore = connectRedis(session)

    const store = new RedisStore({
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASSWORD
    })

    app.use(session({
      store,
      name: SESSION_NAME,
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        max_age: SESSION_LIFETIME,
        sameSite: true,
        secure: IN_PRODUCTION
      }
    }))

    const server = new ApolloServer({
      schema: Schema,
      User,
      playground: !IN_PRODUCTION,
      context: ({ request, result }) => ({ request, result })
    })

    server.applyMiddleware({ app: app })

    app.listen({ port: PORT }, () => console.log(`Server ready at http:localhost:4000${server.graphqlPath}`))
  } catch (error) {
    console.log(error)
  }
})()
