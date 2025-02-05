//server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken')

const authJWT = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, verifyToken) => {
    if (err) {
      return res.status(401).json({ error: 'No token provided' })
    }
    req._id = verifyToken._id
    next()
  })
}

module.exports = { authJWT }
