// ייבוא הספרייה express
const express = require("express");

// יצירת אובייקט Router בסיסי
const router = express.Router();

/**
 * ייבוא של נתיבי-משנה (Sub-Routers) עבור משאבים שונים באפליקציה.
 * כל אחד מהם מטפל בלוגיקה ובנתיבים הקשורים למשאב המתאים (מתנות / משתמשים / אירועים).
 */
const giftRouter = require("./giftRoutes"); // ראוטר לניהול מתנות
const usersRouter = require("./usersRoutes"); // ראוטר לניהול משתמשים
const eventRouter = require("./evnetRoutes"); // ראוטר לניהול אירועים (שימו לב לטעות כתיב בשם הקובץ)

/**
 * הדפסה ללוג לצורך בקרה, התחלת טעינת הראוטים
 */

/**
 * הגדרת הניתובים: כל בקשה שתגיע לנתיב "/gift" תועבר לניהול ב-giftRouter
 * וכל בקשה שתגיע לנתיב "/users" תועבר ל-usersRouter
 * וכל בקשה שתגיע לנתיב "/event" תועבר ל-eventRouter
 */
router.use(
  "/gift",
  (req, res, next) => {
    next();
  },
  giftRouter
);

router.use(
  "/users",
  (req, res, next) => {
    next();
  },
  usersRouter
);

router.use(
  "/events",
  (req, res, next) => {
    next();
  },
  eventRouter
);

/**
 * ייצוא הראוטר הראשי, שיכלול בתוכו את כל ראוטי המשנה (Sub-Routers).
 * מכאן ואילך, בשרת הראשי (app.js או index.js), ניתן יהיה להשתמש בראוטר זה:
 *   app.use('/', mainRouter);
 */
module.exports = router;
