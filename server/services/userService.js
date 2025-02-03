const userController = require('../controllers/userController')
const jwtFn = require('../middleware/jwtMiddleware')
const { fixHebrewText } = require('../fixHebrew.js')


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
  const existUser = await userController.readOne({ email: email })
  if (existUser) {
    throw { code: 405, message: 'duplicated email' }
  }
  const user = await userController.create(userFields)
  const token = jwtFn.createToken(user._id)
  return { token: token, user: user }
}

//getIsManeger
const getIsManeger = async (userId) => {
  if (!userId) throw new Error("❌ Missing userId");
  const user = await userController.readOne({ _id: userId });
  if (!user) throw new Error("❌ User not found");
  return user.isManeger;
}

const updateManagerStatus = async (userId, isManeger) => {
  if (!userId) throw new Error("❌ Missing userId");
  console.log('userId updateManagerStatus:', userId)
  console.log('isManeger updateManagerStatus:', isManeger)

  
  const updatedUser = await userController.updateOne(
    { _id: userId }, // Find user by ID
    { isManeger } // Update field
  );

  if (!updatedUser) throw new Error("❌ User not found");

  return { message: "✅ Manager status updated successfully", user: updatedUser };
};

module.exports = {
  ...module.exports,
  getIsManeger,
  updateManagerStatus,
  login,
  getIdByEmail,
  getGiftsById
}
