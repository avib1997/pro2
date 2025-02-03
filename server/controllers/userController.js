//server/controllers/userController.js
const userModel = require('../models/userModel')

async function create(data) {
  try {
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

async function update(filter, newData) {
  try {
    const result = await userModel.updateOne(filter, newData)
    return result
  } catch (error) {
    throw error
  }
}

// Update the isManeger field by userId
const updateOne = async (filter, updateData) => {
  try {
    const updatedUser = await userModel.findOneAndUpdate(
      filter, // Find user by filter
      updateData, // Update fields
      { new: true } // Return updated document
    );

    return updatedUser;
  } catch (error) {
    console.error("❌ Error updating user:", error);
    throw new Error("❌ Failed to update user");
  }
};



async function del(filter) {
  try {
    const result = await update(filter, { isActive: false })
    return result
  } catch (error) {
    throw error
  }
}

module.exports = { create, readOne, read, update, del, updateOne }
