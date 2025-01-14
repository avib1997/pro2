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
console.log("==> [MAIN ROUTER] העלאת ראוטים פנימיים: gift, users, event");

/**
 * הגדרת הניתובים: כל בקשה שתגיע לנתיב "/gift" תועבר לניהול ב-giftRouter
 * וכל בקשה שתגיע לנתיב "/users" תועבר ל-usersRouter
 * וכל בקשה שתגיע לנתיב "/event" תועבר ל-eventRouter
 */
router.use(
  "/gift",
  (req, res, next) => {
    console.log("==> [MIDDLEWARE] בקשה לנתיב /gift, מפנה ל-giftRouter");
    next();
  },
  giftRouter
);

router.use(
  "/users",
  (req, res, next) => {
    console.log("==> [MIDDLEWARE] בקשה לנתיב /users, מפנה ל-usersRouter");
    next();
  },
  usersRouter
);

router.use(
  "/events",
  (req, res, next) => {
    console.log("==> [MIDDLEWARE] בקשה לנתיב /event, מפנה ל-eventRouter");
    next();
  },
  eventRouter
);

/**
 * ייצוא הראוטר הראשי, שיכלול בתוכו את כל ראוטי המשנה (Sub-Routers).
 * מכאן ואילך, בשרת הראשי (app.js או index.js), ניתן יהיה להשתמש בראוטר זה:
 *   app.use('/', mainRouter);
 */
console.log(
  "==> [MAIN ROUTER] מייצא את ראוטר האב (Main Router) עם כל הראוטים הטעונים"
);
module.exports = router;
