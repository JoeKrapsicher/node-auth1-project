const User = require('../users/users-model')
/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next){
  if(req.session && req.session.user) {
    next();
  } else {
    req.status(401).json({message: "you shall not pass!"})
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
const checkUsernameFree = async (req, res, next) => {
  try{ 
    const rows = await User.findBy({username})
    if(!rows.length) {
      next();
    } else {
      res.status(422).json({message: "Username taken"})
    }
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
const checkUsernameExists = async (req, res, next) => {
  try{
    const rows = await User.findBy({username:req.body.username})
    if(!rows.length) {
      next()
    } else {
      res.staus(401).json("Username already exists")
    }
  }catch(e){
     res.status(422).json(`Invalid credentials`)
   }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  if (!req.body.password || req.body.password.Length < 3) {
    res.status(422).json('Password must be longer than 3 chars')
  } else {
    next();
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {restricted, checkUsernameFree, checkUsernameExists, checkPasswordLength}