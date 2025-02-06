//server/services/giftService.js
const giftController = require('../controllers/giftController.js')
const eventController = require('../controllers/eventController')
const userController = require('../controllers/userController') // ייבוא נדרש
const mongoose = require('mongoose')

const { fixHebrewText } = require('../fixHebrew.js')

module.exports.addgift = async giftFields => {
  console.log(fixHebrewText('נתוני מתנה:', '📥'), giftFields)

  if (!giftFields.phone || !giftFields.amount || !giftFields.EventId) {
    console.error(fixHebrewText('שדה טלפון, סכום או מזהה אירוע חסר!', '❌'))
    throw { code: 400, message: '❌ שדה טלפון, סכום או מזהה אירוע חסר!' }
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(giftFields.EventId)) {
      console.error(fixHebrewText('מזהה האירוע לא תקין:', '❌'), giftFields.EventId)
      throw new Error('❌ מזהה האירוע לא תקין!')
    }

    // 🔍 בדיקה האם המשתמש קיים
    const user = await userController.readOne({ _id: giftFields.userid_gift })
    if (!user) {
      throw { code: 404, message: '❌ המשתמש לא נמצא במסד הנתונים!' }
    }

    console.log(fixHebrewText('מחפש אירוע עם ID:', '🔍'), giftFields.EventId)
    const event = await eventController.readById(giftFields.EventId)

    if (!event) {
      console.error(fixHebrewText('האירוע לא נמצא!', '❌'))
      throw { code: 404, message: '❌ האירוע לא נמצא במסד הנתונים!' }
    }

    console.log(fixHebrewText('האירוע נמצא:', '✅'), event)
    const eventName = `${event.NameOfGroom} & ${event.NameOfBride}`
    console.log(fixHebrewText('שם האירוע שנמצא:', '📌'), eventName)

    const newGift = await giftController.create({
      ...giftFields,
      toEventName: eventName // ✅ הוספת שם האירוע למתנה
    })

    console.log(fixHebrewText('מתנה נוספה בהצלחה:', '✅'), newGift)

    if (giftFields.userid_gift) {
      console.log(fixHebrewText('מחפש משתמש עם ID:', '🔍'), giftFields.userid_gift)
      const user = await userController.readOne({ _id: giftFields.userid_gift })

      if (!user) {
      } else {
        await userController.update({ _id: giftFields.userid_gift }, { $push: { giftsId: newGift._id } })
      }
    }

    console.log(fixHebrewText('מעודכן אירוע עם המתנה החדשה:', '🔄'), giftFields.EventId)
    const updatedEvent = await eventController.update(giftFields.EventId, { $push: { giftsId: newGift._id.toString() } }, { new: true })
    console.log(fixHebrewText('אירוע לאחר עדכון:', '✅'), updatedEvent)
    console.log(fixHebrewText('המתנה נוספה לאירוע בהצלחה', '✅'))

    return { message: '✅ מתנה נוספה בהצלחה', gift: newGift }
  } catch (error) {
    console.error(fixHebrewText('שגיאה בהוספת המתנה:', '❌'), error)
    throw error
  }
}

module.exports.addgiftG = async giftFields => {
  if (!giftFields.phone || !giftFields.amount) {
    throw { code: 400, message: '❌ שדה טלפון או סכום חסר!' }
  }
  let newGift
  try {
    newGift = await giftController.create(giftFields)
    const updatedEvent = await eventController.update(giftFields.EventId, { $push: { giftsId: newGift._id.toString() } }, { new: true })
    return { message: '✅ מתנה נוספה בהצלחה', gift: newGift }
  } catch (error) {
    throw error
  }
}

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
