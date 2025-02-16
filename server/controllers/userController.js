//server/controllers/userController.js
const { set } = require('mongoose')
const userModel = require('../models/userModel')

async function create(data) {
  try {
    console.log('data:', data)
    console.log('data.isManager:', data.isManager)
    console.log('typeof data.isManager:', typeof data.isManager)
    const newUser = await userModel.create(data)
    return newUser
  } catch (error) {
    throw error
  }
}

async function readOne(filter, proj) {
  try {
    const user = await userModel.findOne(filter, proj)
    return user
  } catch (error) {
    throw error
  }
}

async function read(filter, proj) {
  try {
    const users = await userModel.find(filter, proj)
    return users
  } catch (error) {
    throw error
  }
}

// const updatedUser = await userModel.findByIdAndUpdate(
//   userId, // למשל: '67a20b557311038867538be4'
//   {
//     $set: {
//       fname: 'אבי',
//       lname: 'ברודצקי',
//       email: 'bro@gmail.com',
//       password: 'bro',
//       giftsId: ['67a20c9b7311038867538c00'],
//       eventId: ['67a20beb7311038867538bf5'],
//       entryDate: new Date('2025-02-04T12:43:01.603Z'),
//       isManager: true
//     }
//   },
//   { new: true } // אפשרות זו מחזירה את המסמך המעודכן
// )

async function update(filter, newData) {
  try {
    const result = await userModel.updateOne(filter, newData)
    return result
  } catch (error) {
    throw error
  }
}

// Update the isManager field by userId
const updateOne = async (filter, updateData) => {
  console.log('filteeeeeeeer:', filter)
  console.log('updateDaaaaaaata:', updateData)
  try {
    const updatedUser = await userModel.findOneAndUpdate(filter, updateData, { new: true })

    return updatedUser
  } catch (error) {
    console.error('❌ Error updating user:', error)
    throw new Error('❌ Failed to update user')
  }
}

async function del(filter) {
  try {
    const result = await userModel.deleteOne(filter)
    return result
  } catch (error) {
    throw error
  }
}

module.exports = { create, readOne, read, update, del, updateOne }
