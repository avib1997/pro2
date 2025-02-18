//server/services/giftService.js
const giftController = require('../controllers/giftController.js')
const eventController = require('../controllers/eventController')
const userController = require('../controllers/userController') // ייבוא נדרש
const mongoose = require('mongoose')

const { fixHebrewText } = require('../fixHebrew.js')


module.exports.addGift = async (giftFields) => {
  try {
    console.log('📥 נתוני מתנה שהתקבלו:', giftFields);

    // בדיקות חובה
    if (!giftFields.phone || !giftFields.amount || !giftFields.EventId) {
      console.error('❌ שדה טלפון, סכום או מזהה אירוע חסר!');
      throw { code: 400, message: '❌ שדה טלפון, סכום או מזהה אירוע חסר!' };
    }

    // בדיקה אם מזהה האירוע תקין
    if (!mongoose.Types.ObjectId.isValid(giftFields.EventId)) {
      console.error('❌ מזהה האירוע לא תקין:', giftFields.EventId);
      throw new Error('❌ מזהה האירוע לא תקין!');
    }

    // שליפת אירוע מהמסד
    const event = await eventController.readById(giftFields.EventId);
    if (!event) {
      console.error('❌ האירוע לא נמצא במסד הנתונים!');
      throw { code: 404, message: '❌ האירוע לא נמצא במסד הנתונים!' };
    }

    console.log('✅ האירוע נמצא:', event);
    const eventName = `${event.NameOfGroom} & ${event.NameOfBride}`;
    
    // 🔹 הכנת הנתונים של המתנה
    const giftData = {
      name: giftFields.name,
      phone: giftFields.phone,
      blessing: giftFields.blessing,
      amount: giftFields.amount,
      userid_gift: giftFields.userid_gift,
      EventId: giftFields.EventId,
      toEventName: eventName || '',
      file: giftFields.file ? { fileId: giftFields.file.fileId, fileType: giftFields.file.fileType } : undefined
    };

    // 🔹 שליחת הנתונים ל-giftController ליצירת המתנה
    const newGift = await giftController.create(giftData);

    console.log('✅ מתנה נשמרה בהצלחה:', newGift);

    // עדכון רשימת המתנות באירוע
    await eventController.update(giftFields.EventId, { $push: { giftsId: newGift._id.toString() } });

    console.log('✅ המתנה נוספה לאירוע בהצלחה');
    return { message: '✅ מתנה נוספה בהצלחה', gift: newGift };
  } catch (error) {
    console.error('❌ שגיאה בהוספת המתנה:', error);
    throw error;
  }
};

module.exports.addGiftG = async (giftFields) => {
  try {
    console.log('📥 נתוני מתנה מאורח שהתקבלו:', giftFields);

    // בדיקות חובה
    if (!giftFields.phone || !giftFields.amount) {
      console.error('❌ שדה טלפון או סכום חסר!');
      throw { code: 400, message: '❌ שדה טלפון או סכום חסר!' };
    }
    const event = await eventController.readById(giftFields.EventId);
    if (!event) {
      console.error('❌ האירוע לא נמצא במסד הנתונים!');
      throw { code: 404, message: '❌ האירוע לא נמצא במסד הנתונים!' };
    }

    console.log('✅ האירוע נמצא:', event);
    const eventName = `${event.NameOfGroom} & ${event.NameOfBride}`;
    // יצירת המתנה ושמירה במסד
    // 🔹 הכנת הנתונים של המתנה
    const giftData = {
      name: giftFields.name,
      phone: giftFields.phone,
      blessing: giftFields.blessing,
      amount: giftFields.amount,
      EventId: giftFields.EventId,
      toEventName: eventName || '',
      file: giftFields.file ? { fileId: giftFields.file.fileId, fileType: giftFields.file.fileType } : undefined
    };

    // 🔹 שליחת הנתונים ל-giftController ליצירת המתנה
    const newGift = await giftController.create(giftData);

    console.log('✅ מתנה מאורח נשמרה בהצלחה:', newGift);

    // עדכון האירוע עם המתנה החדשה (אם יש EventId)
    if (giftFields.EventId) {
      await eventController.update(giftFields.EventId, { $push: { giftsId: newGift._id.toString() } });
      console.log('✅ המתנה נוספה לאירוע בהצלחה');
    }

    return { message: '✅ מתנה נוספה בהצלחה', gift: newGift };
  } catch (error) {
    console.error('❌ שגיאה בהוספת המתנה (אורח):', error);
    throw error;
  }
};

module.exports.getgift = async giftsId => {
  let giftId = Object.values(giftsId)
  giftId = giftId[0]
  let gift = []
  for (let index = 0; index < giftId.length; index++) {
    const element = giftId[index]
    gift.push(await giftController.readById(element))
  }
  return gift
}

module.exports.getGiftsByEvent = async eventID => {
  try {
    const gifts = await giftController.read(eventID)
    console.log('🎁 Gifts:(getGiftsByEvent)', gifts)
    return gifts
  } catch (error) {
    return { error: 'Failed to get gifts by event' }
  }
}

module.exports.getAllGifts = async () => {
  try {
    const gifts = await giftController.read({})
    return gifts
  } catch (error) {
    return { error: 'Failed to get all gifts' }
  }
}
