const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  // The argument given to the populate method defines that the ids referencing blog objects in the
  // `blogs` field of the user document will be replaced by the referenced blog documents.
  // Mongoose first queries the users collection for the list of users, and then queries the collection
  // corresponding to the model object specified by the ref property in the users schema for data with the given object id.
  const users = await User
    .find({}).populate('blogs', { author: 1, title: 1, url: 1 })

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username) {
    return response.status(400).json({
      error: 'Username is required'
    })
  }

  if (!password) {
    return response.status(400).json({
      error: 'Password is required'
    })
  }

  if (username.length < 3) {
    return response.status(400).json({
      error: 'Username must be at least 3 characters long'
    })
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: 'Password must be at least 3 characters long'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  // toJSON() is called, which deletes the hashed password
  response.status(201).json(savedUser)
})

module.exports = usersRouter