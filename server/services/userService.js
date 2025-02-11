//server/services/userService.js
const userController = require('../controllers/userController')
const jwtFn = require('../middleware/jwtMiddleware')
const { fixHebrewText } = require('../fixHebrew.js')
const { update } = require('../controllers/giftController.js')

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
  user = await userController.readOne({ password: password })
  if (!user || user.password !== password) {
    throw { code: 401, message: 'password not correct' }
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
  if (!userFields.email || !userFields.password || !userFields.fname || !userFields.lname) {
    throw { code: 400, message: 'missing data' }
  }
  const email = userFields.email
  const existUser = await userController.readOne({ email: email })
  if (existUser) {
    throw { code: 405, message: 'duplicated email' }
  }
  const user = await userController.create(userFields)
  const token = jwtFn.createToken(user._id)
  return { token: token, user: user }
}

//getIsManeger
const getIsManeger = async userId => {
  if (!userId) throw new Error('❌ Missing userId')
  const user = await userController.readOne({ _id: userId })
  if (!user) throw new Error('❌ User not found')
  return user.isManeger
}

exports.updateUser = (filter, newData) => {
  //אני צריך ש newData יכיל רק את השדות שאני רוצה לעדכן: {fname: , lname: , email: , password: , isManeger: }
  newData = { fname: newData.fname, lname: newData.lname, email: newData.email, password: newData.password, isManeger: newData.isManeger }

  console.log('filterrrrrrrrrr:', filter)
  console.log('newDataaaaaaaa:', newData)
  if (!newData) {
    throw { code: 400, message: 'there is no new data' }
  }
  const updatedUser = userController.updateOne(filter, newData)
  return { message: 'user updated successfully', user: updatedUser }
}

const updateManagerStatus = async (userId, isManeger) => {
  if (!userId) throw new Error('❌ Missing userId')
  console.log('userId updateManagerStatus:', userId)
  console.log('isManeger updateManagerStatus:', isManeger)

  const updatedUser = await userController.updateOne(
    { _id: userId }, // Find user by ID
    { isManeger } // Update field
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
  getIsManeger,
  updateManagerStatus,
  login,
  getIdByEmail,
  getGiftsById,
  getAllUsers,
  deleteUser
}
