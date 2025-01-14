const express = require("express");
const router = express.Router();
const giftLogic = require("../BL/giftLogic");
const auth = require("../middlewere/auth");

/**
 * [POST] /addGift
 * תפקיד: להוסיף מתנה חדשה. במידה וקיים userid_gift ב-req.body, יקרא לפונקציה addgift,
 * אחרת addgiftG.
 */
router.post("/addGift", async (req, res) => {
  console.log("==> [INFO] התחלת עיבוד בקשה לנתיב /addGift", { body: req.body });

  if (req.body.userid_gift) {
    console.log("==> [DEBUG] זוהה userid_gift, קורא לפונקציה addgift");
    try {
      await giftLogic.addgift(req.body);
      console.log("==> [SUCCESS] מתנה נוספה בהצלחה באמצעות addgift");
      return res
        .status(200)
        .send({ message: "מתנה נוספה בהצלחה (עם userid_gift)" });
    } catch (error) {
      console.error("==> [ERROR] כשל בהוספת מתנה (addgift):", error);
      return res.status(500).send({ error: "שגיאה בהוספת המתנה (addgift)" });
    }
  } else {
    console.log("==> [DEBUG] לא זוהה userid_gift, קורא לפונקציה addgiftG");
    try {
      await giftLogic.addgiftG(req.body);
      console.log("==> [SUCCESS] מתנה נוספה בהצלחה באמצעות addgiftG");
      return res.status(200).send({ message: "מתנה נוספה בהצלחה (addgiftG)" });
    } catch (error) {
      console.error("==> [ERROR] כשל בהוספת מתנה (addgiftG):", error);
      return res.status(500).send({ error: "שגיאה בהוספת המתנה (addgiftG)" });
    }
  }
});

/**
 * [POST] /getgift
 * תפקיד: להחזיר רשימת מתנות לפי הנתונים המתקבלים ב-req.body.
 */
router.post("/getgift", async (req, res) => {
  console.log("==> [INFO] התחלת עיבוד בקשה לנתיב /getgift", { body: req.body });

  try {
    const gifts = await giftLogic.getgift(req.body);
    console.log("==> [SUCCESS] המתנות שהתקבלו:", gifts);
    return res.status(200).send(gifts);
  } catch (error) {
    console.error("==> [ERROR] כשל בקבלת המתנות:", error);
    return res.status(500).send({ error: "שגיאה בעת בקשת המתנות" });
  }
});

module.exports = router;
