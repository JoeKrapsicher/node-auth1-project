// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs');
const User = require('../users/users-model');

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */
  router.post('/api/auth/register', (req, res, next) => {
    console.log("registering")
  
    let user = req.body;
  
    const hash = bcrypt.hashSync(user.password, 12)
    
    user.password = hash;
  
    User.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(err => {
        res.status(500).json(err)
      })
  })

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */
  router.post('/api/auth/login', (req, res, next)=> {
    let {username, password } = req.body;
  
    User.findBy({username})
    .first()
    .then(user => {
      if(user && bcrypt.compareSync(password, user.password)) {
        res.session.user = user;
        res.status(200).json({message: `Welcome ${user.username}!`})
      } else {
        res.status(401).json({message: 'Invalid Credentials'})
      }
    })
    .catch(err => {
      res.status(500).json(err)
    })
  })

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

  router.get('/api/auth/logout', (req, res, nex) => {
    if(req.session){
      req.session.destroy(err => {
        if(err) {
          res.json({message: 'cant logout :)'})
        } else {
          res.status(200).json({message: 'bye bee!'})
        }
      })
    } else {
      res.status(200).json({message: 'you never logged in (:'})
    }
  })
 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router