const userController = require('../controllers/userController')
const jwtFn = require('../middleware/jwtMiddleware')

async function getGiftsById(userId) {
  const arrGifts = await userController.readOne({ ObjectId: userId })
  return { arrGifts: arrGifts }
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

exports.updateUser = (filter, newData) => {
  if (!newData) {
    throw { code: 400, message: 'there is no new data' }
  }
  userController.update(filter, newData)
}

module.exports.register = async userFields => {
  if (!userFields.email || !userFields.password || !userFields.fname || !userFields.lname) {
    throw { code: 400, message: 'missing data' }
  }
  const email = userFields.email
  const existUser = await userController.readOne({ email })
  if (existUser) {
    throw { code: 405, message: 'duplicated email' }
  }
  const user = await userController.create(userFields)
  const token = jwtFn.createToken(user._id)
  return { token: token, user: user }
}

module.exports = {
  ...module.exports,
  login,
  getIdByEmail,
  getGiftsById
}
