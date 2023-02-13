// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login')
    }
    next()
}

  // if an already logged in user tries to access the login page it
  // redirects the user to the home page

const isLoggedOut = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/')
    }
    next()
}


const isCreator = (req, res, next) => {
    if (req.user.role === 'creator') next();
    else res.redirect('/login');
  }


module.exports = {
    isLoggedIn,
    isLoggedOut,
    isCreator,
} 