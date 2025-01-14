const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_JWT; // מומלץ לוודא שהערך מאותחל כראוי בקובץ .env או בסביבת הריצה

/**
 * יוצר טוקן (JWT) עם תוקף של שעה אחת.
 * הערה: "supersecret_dont_share" מומלץ להעביר כמשתנה סביבה במקום בקוד קשיח.
 */
function createToken(_id) {
  console.log("==> [INFO] יצירת טוקן עבור משתמש עם _id:", _id);

  const accessToken = jwt.sign({ _id }, "supersecret_dont_share", {
    expiresIn: "1h",
  });

  console.log("==> [SUCCESS] טוקן נוצר בהצלחה:", accessToken);
  return accessToken;
}

/**
 * מאמת טוקן באמצעות ה-secret המגיע ממשתנה הסביבה.
 */
function validateToken(token) {
  console.log("==> [INFO] התחלת תהליך אימות הטוקן:", token);

  try {
    const decoded = jwt.verify(token, secret);
    console.log("==> [SUCCESS] הטוקן אומת בהצלחה:", decoded);
    return decoded;
  } catch (err) {
    console.error("==> [ERROR] אימות הטוקן נכשל:", err.message);
    throw err;
  }
}

module.exports = { createToken, validateToken };
