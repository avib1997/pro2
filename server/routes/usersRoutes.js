// ייבוא ספריות נדרשות
const express = require("express"); // ספריית Express ליצירת שרת וראוטרים
const router = express.Router(); // יצירת אובייקט Router לניהול ראוטים (נתיבים)
// const { User } = require("../DL/models/users"); // מודל משתמשים מהשכבה הדאטה (Data Layer)
// const bcrypt = require("bcryptjs"); // ספרייה להצפנת סיסמאות (bcrypt)
// const userControler = require("../DL/controllers/userController"); // בקר המשתמשים (לא בשימוש בקוד הנוכחי, אך מיובא)
const userLogic = require("../BL/userLogic"); // לוגיקה עסקית (Business Logic) הקשורה למשתמשים
// const auth = require("../middlewere/auth"); // מידלוור לאימות משתמשים (Authentication) - לא בשימוש כרגע בקוד

/**
 * נתיב POST: /login
 * תפקיד: לבצע התחברות של משתמש קיים.
 * תהליך:
 *  1. מקבל את פרטי המשתמש (email, password) בגוף הבקשה (req.body).
 *  2. מעביר את הנתונים לפונקציית login בשכבת הלוגיקה העסקית.
 *  3. מקבל טוקן בחזרה ושולח אותו כ-Response ללקוח.
 *  4. במידה ויש שגיאה, מטפלים בה בלוג ומחזירים הודעה מתאימה.
 */
router.post("/login", async (req, res) => {
  console.log("נתוני הבקשה (req.body):", req.body);

  try {
    // קריאה ללוגיקה העסקית על מנת להתחבר עם נתוני המשתמש
    const token = await userLogic.login(req.body);

    // הדפסת הלוג על יצירת הטוקן
    console.log("טוקן נוצר בהצלחה:", token);

    // שליחת הטוקן חזרה ללקוח
    res.send({ token: token });
  } catch (err) {
    // טיפול בשגיאה: הצגת השגיאה בלוג
    console.log("[ERROR] בשירות login:", err.message);

    // החזרת הודעת השגיאה כ-Response ללקוח
    res.send(err.message);
  }
});

/**
 * נתיב POST: /register
 * תפקיד: ליצור משתמש חדש במערכת.
 * תהליך:
 *  1. מקבל פרטי משתמש חדשים (שם, אימייל, סיסמה, וכו') ב-body.
 *  2. שולח את הפרטים לפונקציית register בשכבת הלוגיקה העסקית.
 *  3. מחזיר אובייקט של המשתמש החדש שנוצר בתגובה.
 *  4. במקרה של שגיאה, מדפיס ללוג הודעת שגיאה.
 */
router.post("/register", async (req, res) => {
  console.log("נתוני הבקשה (req.body):", req.body);

  try {
    // יצירת משתמש חדש דרך שכבת הלוגיקה
    const newUser = await userLogic.register(req.body);

    // הדפסת הלוג על יצירת המשתמש
    console.log("משתמש חדש נוצר בהצלחה:", newUser);

    // שליחת אובייקט המשתמש החדש כ-Response
    res.send(newUser);
  } catch (err) {
    // טיפול בשגיאה: הצגת השגיאה בלוג

    // ניתן לשלוח גם err.message או סטטוס 500 בהתאם
    res.status(500).send({ error: err.message });
  }
});

/**
 * נתיב POST: /userid
 * תפקיד: לקבל userId ע"פ אימייל.
 * תהליך:
 *  1. מקבל email בגוף הבקשה.
 *  2. מפעיל את הפונקציה getIdByEmail בשכבת הלוגיקה העסקית.
 *  3. מחזיר ללקוח את ה-userId המתאים.
 */
router.post("/userid", async (req, res) => {
  console.log("נתוני הבקשה (req.body):", req.body);

  try {
    // חילוץ ה-id לפי אימייל
    const userid = await userLogic.getIdByEmail(req.body.email);

    // הצגת ה-id שהוחזר בלוג
    console.log("מזהה המשתמש שהוחזר:", userid);

    // שליחת ה-id כ-Response
    res.send(userid);
  } catch (err) {
    // טיפול בשגיאה: הצגת השגיאה בלוג

    // החזרת הודעת שגיאה או סטטוס מתאים
    res.status(500).send({ error: err.message });
  }
});

/**
 * נתיב GET: /
 * תפקיד: להחזיר את כל המשתמשים הרשומים במערכת.
 * תהליך:
 *  1. קריאה לפונקציית getAllUsers בשכבת הלוגיקה העסקית.
 *  2. קבלת רשימת משתמשים והחזרתם כ-Response.
 *  3. טיפול בשגיאה במידת הצורך.
 */
router.get("/", async (req, res) => {
  console.log("אובייקט הבקשה (req):", req);

  try {
    // קבלת כל המשתמשים מהלוגיקה העסקית
    const users = await userLogic.getAllUsers();

    // הצגת כמות המשתמשים שהוחזרה
    console.log("מספר המשתמשים שהוחזרו:", users.length);

    // החזרת רשימת המשתמשים
    res.send(users);
  } catch (err) {
    // טיפול בשגיאה: הצגת השגיאה בלוג

    // החזרת שגיאה סטנדרטית
    res.status(500).send({ message: "somthing went wrong" });
  }
});

/**
 * נתיב POST: /giftsById
 * תפקיד: להחזיר מערך של מתנות (gifts) לפי ID מסוים.
 * תהליך:
 *  1. מקבל מידע כלשהו ב-body (לרוב userId).
 *  2. מעביר את הנתונים לפונקציית getGiftsById בלוגיקה העסקית.
 *  3. מחזיר מערך המתנות כ-Response ללקוח.
 */
router.post("/giftsById", async (req, res) => {
  console.log("נתוני הבקשה (req.body):", req.body);

  try {
    // קבלת המערך מהלוגיקה העסקית
    const arrGifts = await userLogic.getGiftsById(req.body);

    // הדפסת הלוג על התוצאה
    console.log("arrgifts in user Routes:", arrGifts);

    // החזרת התוצאה כ-Response
    res.send(arrGifts);
  } catch (err) {
    // טיפול בשגיאה: הצגת השגיאה בלוג

    // החזרת הודעת שגיאה או סטטוס מתאים
    res.status(500).send({ error: err.message });
  }
});

// ייצוא הראוטר
module.exports = router;
