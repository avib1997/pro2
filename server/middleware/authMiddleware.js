const jwt = require('jsonwebtoken')
const { validateToken } = require('./jwtMiddleware')

/**
 * Middleware לאימות טוקן JWT:
 *  1. קורא את הטוקן מתוך ה-Header Authorization (צפוי בפורמט "Bearer <token>").
 *  2. מוודא שהטוקן תקין, אחרת מחזיר 403 (Forbidden).
 *  3. אם הטוקן תקין, מוסיף את המזהה (req._id) ומשתמש ב-next() כדי להמשיך לראוט הבא.
 */
const authJWT = (req, res, next) => {
  // מוודא שה-authorization header קיים
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.sendStatus(401) // Unauthorized
  }

  // הנחת העבודה היא ש-authHeader מגיע בצורת "Bearer <token>"
  // לכן מפצלים באמצעות רווח (space) ושולפים את החלק השני שהוא הטוקן
  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.sendStatus(401)
  }

  // אימות הטוקן בעזרת ספריית jwt וה-secret מהסביבה
  jwt.verify(token, process.env.SECRET_JWT, (err, verifyToken) => {
    if (err) {
      return res.sendStatus(403) // Forbidden
    }

    // הטוקן תקין - ניתן לחלץ ממנו מידע (למשל _id)
    req._id = verifyToken._id

    // מעבר לשלב הבא בשרשרת המידלוור/ראוטים
    next()
  })
}

module.exports = { authJWT }
