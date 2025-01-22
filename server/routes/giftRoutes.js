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

  if (req.body.userid_gift) {
    try {
      await giftLogic.addgift(req.body);
      return res
        .status(200)
        .send({ message: "מתנה נוספה בהצלחה (עם userid_gift)" });
    } catch (error) {
      return res.status(500).send({ error: "שגיאה בהוספת המתנה (addgift)" });
    }
  } else {
    try {
      await giftLogic.addgiftG(req.body);
      return res.status(200).send({ message: "מתנה נוספה בהצלחה (addgiftG)" });
    } catch (error) {
      return res.status(500).send({ error: "שגיאה בהוספת המתנה (addgiftG)" });
    }
  }
});

/**
 * [POST] /getgift
 * תפקיד: להחזיר רשימת מתנות לפי הנתונים המתקבלים ב-req.body.
 */
router.post("/getgift", async (req, res) => {

  try {
    const gifts = await giftLogic.getgift(req.body);
    return res.status(200).send(gifts);
  } catch (error) {
    return res.status(500).send({ error: "שגיאה בעת בקשת המתנות" });
  }
});

module.exports = router;
