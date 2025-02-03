const eventModel = require('../models/eventModel');
const giftModel = require('../models/giftModel');
const userModel = require('../models/userModel');

const deleteAllEvents = async () => {
    try {
        await eventModel.deleteMany({});
        console.log('✅ כל האירועים נמחקו בהצלחה!');
    } catch (error) {
        console.error('❌ שגיאה במחיקת האירועים:', error);
        throw new Error('Failed to delete all events');
    }
};

const deleteAllGifts = async () => {
    try {
        await giftModel.deleteMany({});
        console.log('✅ כל המתנות נמחקו בהצלחה!');
    } catch (error) {
        console.error('❌ שגיאה במחיקת המתנות:', error);
        throw new Error('Failed to delete all gifts');
    }
};

const deleteAllUsers = async () => {
    try {
        await userModel.deleteMany({});
        console.log('✅ כל המשתמשים נמחקו בהצלחה!');
    } catch (error) {
        console.error('❌ שגיאה במחיקת המשתמשים:', error);
        throw new Error('Failed to delete all users');
    }
};

module.exports = {
    deleteAllEvents,
    deleteAllGifts,
    deleteAllUsers
};
