export const {
  PORT = 4000,
  ENVIRONMENT = 'development',

  USERNAME = 'chat',
  PASSWORD = 'chat',
  HOST = 'chat-fod2a.mongodb.net',
  DATABASE_PORT = 27017,

  OPTIONS = '/test?retryWrites=true',
  SESSION_NAME = 'sessionID',
  SESSION_SECRET = 'secret',
  SESSION_LIFETIME = 1000 * 60 * 60 * 2, // two hours

  REDIS_HOST = 'localhost',
  REDIS_PORT = 6379,
  REDIS_PASSWORD = 'secret'
} = process.env

export const IN_PRODUCTION = ENVIRONMENT === 'production'
