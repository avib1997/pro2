const jwt = require('jsonwebtoken')
const secret = process.env.SECRET_JWT // מומלץ לוודא שהערך מאותחל כראוי בקובץ .env או בסביבת הריצה

/**
 * יוצר טוקן (JWT) עם תוקף של שעה אחת.
 * הערה: "supersecret_dont_share" מומלץ להעביר כמשתנה סביבה במקום בקוד קשיח.
 */
function createToken(_id) {
  const accessToken = jwt.sign({ _id }, 'supersecret_dont_share', {
    expiresIn: '1h'
  })

  return accessToken
}

/**
 * מאמת טוקן באמצעות ה-secret המגיע ממשתנה הסביבה.
 */
function validateToken(token) {
  try {
    const decoded = jwt.verify(token, secret)
    return decoded
  } catch (err) {
    throw err
  }
}

module.exports = { createToken, validateToken }
