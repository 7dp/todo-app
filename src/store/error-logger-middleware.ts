import { isRejectedWithValue } from '@reduxjs/toolkit'
import { Middleware, MiddlewareAPI } from 'redux'


const errorLoggerMiddleware: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    // console.log('errorLoggerMiddleware() action:', JSON.stringify(action, null, 2))
    // console.log('errorLoggerMiddleware() api:', JSON.stringify(api, null, 2))

    const { message } = action?.payload?.data
  }

  return next(action)
}

export { errorLoggerMiddleware }
