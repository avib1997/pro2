const userController = require("../DL/controllers/userController");
const jwtFn = require("../middlewere/jwt");
const bcrypt = require("bcryptjs");

/**
 * מחזיר מתנות של משתמש לפי userId (ObjectId).
 * @param {String} userId - מזהה המשתמש.
 * @returns {Promise<Object>} אובייקט עם arrGifts: מכיל את פרטי המתנות.
 */
async function getGiftsById(userId) {
  console.log("==> [INFO] התחלת קריאת מתנות למשתמש לפי ID:", userId);

  const arrGifts = await userController.readOne({ ObjectId: userId });
  console.log("==> [SUCCESS] נמצאו מתנות (arrGifts):", arrGifts);

  return { arrGifts: arrGifts };
}

/**
 * מוצא את מזהה המשתמש (userId) לפי אימייל.
 * @param {String} email - אימייל של המשתמש.
 * @returns {Promise<Object>} אובייקט עם userid: מערך משתמשים או משתמש.
 */
async function getIdByEmail(email) {
  console.log("==> [INFO] התחלת חיפוש מזהה משתמש לפי אימייל:", email);

  const userid = await userController.read({ email: email });
  if (!userid) {
    console.error("==> [ERROR] משתמש לא נמצא עבור האימייל:", email);
    throw { code: 401, message: "getIdByEmail error" };
  }
  console.log("==> [SUCCESS] נמצא userId:", userid);

  return { userid: userid };
}

/**
 * תהליך התחברות (Login) – מאמת אימייל וסיסמה מול בסיס הנתונים ויוצר טוקן (JWT).
 * הערה: מומלץ להשתמש ב-bcrypt להשוואת סיסמה מוצפנת במקום לחפש את המשתמש לפי סיסמה.
 *       כמו כן, משתנה user מושפע פעמיים, ייתכן שזהו באג לוגי שכדאי לתקן.
 * @param {Object} loginData - אובייקט עם email ו-password.
 * @returns {Promise<Object>} אובייקט המכיל token (JWT).
 */
async function login(loginData) {
  console.log("==> [INFO] התחלת תהליך login עם נתונים:", loginData);

  const email = loginData.email;
  if (!email) {
    console.error("==> [ERROR] לא הוזן אימייל בבקשה");
    throw { code: 401, message: "missing data" };
  }

  let user = await userController.readOne({ email: email });
  if (!user) {
    console.error("==> [ERROR] משתמש לא קיים עבור האימייל:", email);
    throw { code: 401, message: "not exist" };
  }

  // בדיקה בסיסית שהאימייל המאוחזר זהה לאימייל שנשלח
  if (user.email !== email) {
    console.error("==> [ERROR] אימייל לא תואם את הרשום במסד הנתונים");
    throw { code: 401, message: "unauthorized" };
  }

  // בדיקה בסיסית (לא מאובטחת) של הסיסמה
  const password = loginData.password;
  console.log("==> [DEBUG] הסיסמה שהתקבלה ב-login:", password);

  //  הערה: בשלב זה user מפורמט מחדש בקריאה נוספת,
  //  ייתכן שזו טעות או בדיקה נוספת – מומלץ במקום זאת להשתמש ב-bcrypt.compare:
  user = await userController.readOne({ password: password });

  // כאן בודקים (בצורה לא מומלצת) אם הסיסמה תואמת
  if (!user || user.password !== password) {
    console.error("==> [ERROR] סיסמה לא תקינה או משתמש לא קיים");
    // throw { code: 401, message: "password not correct" };
  }

  // יצירת טוקן
  const token = jwtFn.createToken(user._id);
  console.log("==> [SUCCESS] טוקן נוצר בהצלחה:", token);

  return { token: token };
}

/**
 * מחזיר את כל המשתמשים (אם יש).
 * @throws {Object} שגיאה אם אין משתמשים.
 */
module.exports.getAllUsers = async () => {
  console.log("==> [INFO] התחלת קריאת כל המשתמשים");
  const users = await userController.read({});
  if (users.length === 0) {
    console.error("==> [ERROR] לא נמצאו משתמשים במערכת");
    throw { code: 400, message: "there is no users" };
  }
  console.log("==> [SUCCESS] מספר המשתמשים שנמצאו:", users.length);

  // קריאה חוזרת ל-read – ייתכן מיותרת או חלק משימוש פנימי
  userController.read({});
};

/**
 * מחזיר פרטי משתמש לפי מזהה (ללא החזרה במפורש) – ייתכן שזהו מימוש חלקי.
 * כדאי להחזיר את תוצאת הפעולה או await.
 * @param {String} id - מזהה המשתמש.
 */
exports.getUserDetailsById = (id) => {
  console.log("==> [INFO] קריאת פרטי משתמש לפי ID:", id);
  userController.read({ _id: id });
};

/**
 * יצירת משתמש חדש (ללא החזרת תוצאה) – מומלץ להשתמש ב-await ולהחזיר את אובייקט המשתמש שנוצר.
 * @param {Object} userFields - שדות המשתמש ליצירה.
 */
exports.createUser = (userFields) => {
  console.log("==> [INFO] התחלת יצירת משתמש חדש:", userFields);

  if (Object.keys(userFields).length === 0) {
    console.error("==> [ERROR] חסרים פרטי משתמש ליצירה");
    throw { code: 400, message: "there is no user fields" };
  }
  userController.create(userFields);
};

/**
 * עדכון משתמש – לא מחזיר תוצאה למעלה. מומלץ להשתמש ב-await ולהחזיר את תוצאת העדכון.
 * @param {Object} filter - פילטר לאיתור המשתמש.
 * @param {Object} newData - אובייקט השינויים לעדכון.
 */
exports.updateUser = (filter, newData) => {
  console.log(
    "==> [INFO] עדכון משתמש עם הפילטר:",
    filter,
    "ושינויים:",
    newData
  );

  if (!newData) {
    console.error("==> [ERROR] חסרים נתונים חדשים לעדכון המשתמש");
    throw { code: 400, message: "there is no new data" };
  }
  userController.update(filter, newData);
};

/**
 * רישום משתמש חדש (Register):
 *  1. בדיקה שחובה למלא email, password, fname, lname.
 *  2. בדיקה שאין משתמש קיים עם email זהה.
 *  3. יוצרים את המשתמש (מומלץ להצפין סיסמה).
 *  4. יוצרים טוקן ומחזירים אותו יחד עם אובייקט המשתמש.
 */
module.exports.register = async (userFields) => {
  console.log("==> [INFO] התחלת רישום משתמש חדש:", userFields);

  // בדיקה אם חסרים שדות
  if (
    !userFields.email ||
    !userFields.password ||
    !userFields.fname ||
    !userFields.lname
  ) {
    console.error("==> [ERROR] אחד השדות החיוניים חסר", userFields);
    throw { code: 400, message: "missing data" };
  }

  // בדיקה אם האימייל כבר בשימוש
  const email = userFields.email;
  const existUser = await userController.readOne({ email });
  if (existUser) {
    console.error("==> [ERROR] האימייל קיים כבר במערכת:", email);
    throw { code: 405, message: "duplicated email" };
  }

  // דוגמה לאיך אפשר לבצע Hashing לסיסמה (לא סיימנו בקוד בפועל):
  // const salt = await bcrypt.genSalt();
  // const hashedPassword = await bcrypt.hash(userFields.password, salt);
  // userFields.salt = salt;
  // userFields.hashedPassword = hashedPassword;

  // יצירת משתמש חדש
  const user = await userController.create(userFields);
  console.log("==> [SUCCESS] משתמש חדש נוצר:", user._id);

  // יצירת טוקן עבור המשתמש החדש
  const token = jwtFn.createToken(user._id);
  console.log("==> [SUCCESS] טוקן נוצר עבור המשתמש החדש:", token);

  return { token: token, user: user };
};

// ייצוא הפונקציות הנוספות
module.exports = {
  ...module.exports,
  login,
  getIdByEmail,
  getGiftsById,
};
