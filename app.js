// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv').config()

// ℹ️ Connects to the database
require('./db')

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express')

const app = express()

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require('./config')(app)
require('./config/session.config')(app)

// default value for title local
const capitalize = require('./utils/capitalize')
const projectName = 'Welcome to Hogwarts remote!'

//some change signed by Diana

app.locals.appTitle = `${capitalize(projectName)}`

// 👇 Start handling routes here
const indexRoutes = require('./routes/index.routes')
app.use('/', indexRoutes)

const authRoutes = require('./routes/auth.routes')
const { isLoggedOut } = require('./middleware/route-guard')
app.use('/auth', isLoggedOut, authRoutes)

const profileRoutes = require('./routes/profile.routes')
const { isLoggedIn } = require('./middleware/route-guard')
app.use('/profile', isLoggedIn, profileRoutes)

//Hat quizz route
const hatQuizzRoutes = require('./routes/index.routes')
app.use('/hatquizz', hatQuizzRoutes)





// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app)













module.exports = app


// My name is Alexia 
// My name is Diana
