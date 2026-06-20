# Phonebook App

A simple **phonebook application** built as part of the Full Stack Open course:

https://fullstackopen.com/

## Live Demo

Deployed here:  
https://fullstackopen-vmyy.onrender.com

---

## Features

- Add new contacts
- Update existing contacts
- Delete contacts
- Search/filter contacts
- Persistent storage with MongoDB

---

## Tech Stack

- Node.js
- Express
- React (frontend)
- MongoDB + Mongoose

---

## Running the App Locally

```bash
$ cd backend

# Install dependencies
$ npm install

# Build frontend assets
$ npm run build:ui

# Create a .env file with your MongoDB connection url
$ echo "MONGODB_URI=<YOUR-MONGODB-URI>" > .env

# Start the application in development mode
$ npm run dev
```

You should now be able to access the app at: http://localhost:3001