//server/services/userService.js
const userController = require('../controllers/userController')
const jwtFn = require('../middleware/jwtMiddleware')
const { fixHebrewText } = require('../fixHebrew.js')
const { update } = require('../controllers/giftController.js')
const { object } = require('joi')
const bcrypt = require('bcrypt'); // או require('bcryptjs')

const SALT_ROUNDS = 10;


async function getGiftsById(userId) {
  const userDetails = await userController.readOne(userId)
  return userDetails.giftsId
}

async function getIdByEmail(email) {
  const userid = await userController.read({ email: email })
  if (!userid) {
    throw { code: 401, message: 'getIdByEmail error' }
  }
  return { userid: userid }
}

async function login(loginData) {
  const email = loginData.email
  if (!email) {
    throw { code: 401, message: 'missing data' }
  }
  let user = await userController.readOne({ email: email })
  if (!user) {
    throw { code: 401, message: 'not exist' }
  }
  if (user.email !== email) {
    throw { code: 401, message: 'unauthorized' }
  }
  const password = loginData.password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { code: 401, message: 'Password incorrect' };
  }

  const token = jwtFn.createToken(user._id)
  return { token: token }
}

module.exports.getAllUsers = async () => {
  const users = await userController.read({})
  if (users.length === 0) {
    throw { code: 400, message: 'there is no users' }
  }
  userController.read({})
}

exports.getUserDetailsById = id => {
  userController.read({ _id: id })
}

exports.createUser = userFields => {
  if (Object.keys(userFields).length === 0) {
    throw { code: 400, message: 'there is no user fields' }
  }
  userController.create(userFields)
}

module.exports.register = async userFields => {
  try {
    if (Object.keys(userFields).length === 0) {
      console.log('keys:', Object.keys(userFields));
      console.log('values:', Object.values(userFields));
      throw new Error('❌ Missing user fields');
    }

    console.log('userFields:', userFields);
    const email = userFields.email;
    
    // בדיקה אם המשתמש כבר קיים
    const existUser = await userController.readOne({ email: email });
    if (existUser) {
      throw new Error('❌ User already exists');
    }
    
    const hashedPassword = await bcrypt.hash(userFields.password, SALT_ROUNDS);
    userFields.password = hashedPassword;
    
    // יצירת משתמש חדש
    const user = await userController.create(userFields);
    console.log('✅ User created successfully:', user);

    // יצירת טוקן עבור המשתמש
    const token = jwtFn.createToken(user._id);

    return { user, token };
  } catch (error) {
    console.error('❌ Error in register:', error.message);
    throw error; // הזרקת השגיאה החוצה כדי לטפל בה בראוטר
  }
};


//getisManager
const getisManager = async userId => {
  if (!userId) throw new Error('❌ Missing userId')
  const user = await userController.readOne({ _id: userId })
  if (!user) throw new Error('❌ User not found')
  return user.isManager
}

exports.updateUser = (filter, newData) => {
  //אני צריך ש newData יכיל רק את השדות שאני רוצה לעדכן: {fname: , lname: , email: , password: , isManager: }
  newData = { fname: newData.fname, lname: newData.lname, email: newData.email, password: newData.password, isManager: newData.isManager }

  console.log('filterrrrrrrrrr:', filter)
  console.log('newDataaaaaaaa:', newData)
  if (!newData) {
    throw { code: 400, message: 'there is no new data' }
  }
  const updatedUser = userController.updateOne(filter, newData)
  return { message: 'user updated successfully', user: updatedUser }
}

const updateManagerStatus = async (userId, isManager) => {
  if (!userId) throw new Error('❌ Missing userId')
  console.log('userId updateManagerStatus:', userId)
  console.log('isManager updateManagerStatus:', isManager)

  const updatedUser = await userController.updateOne(
    { _id: userId }, // Find user by ID
    { isManager } // Update field
  )

  if (!updatedUser) throw new Error('❌ User not found')

  return { message: '✅ Manager status updated successfully', user: updatedUser }
}

const getAllUsers = async () => {
  const users = await userController.read({})
  if (users.length === 0) {
    throw { code: 400, message: 'there is no users' }
  }
  return users
}

const deleteUser = async userId => {
  if (!userId) {
    throw { code: 400, message: 'missing userId' }
  }

  const deleted = await userController.del({ _id: userId })
  return deleted
}

module.exports = {
  ...module.exports,
  getisManager,
  updateManagerStatus,
  login,
  getIdByEmail,
  getGiftsById,
  getAllUsers,
  deleteUser
}
