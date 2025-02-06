//server/controllers/giftController.js
const giftModel = require('../models/giftModel')

async function create(data) {
  try {
    const newGift = await giftModel.create(data)
    return newGift
  } catch (error) {
    throw error
  }
}

async function readOne(filter, proj) {
  try {
    const gift = await giftModel.findOne(filter, proj)
    return gift
  } catch (error) {
    throw error
  }
}

async function readById(filter) {
  try {
    const gift = await giftModel.findById(filter)
    return gift
  } catch (error) {
    throw error
  }
}

async function read(filter) {
  console.log('🎁 Data received:(read,giftController)', filter)
  try {
    const gifts = await giftModel.find(filter)
    console.log('🎁 Data sent:(find,giftController)', gifts)
    return gifts
  } catch (error) {
    throw error
  }
}

async function update(filter, data) {
  try {
    const result = await giftModel.updateOne(filter, data)
    return result
  } catch (error) {
    throw error
  }
}

async function del(_id) {
  try {
    const result = await update({ _id }, { isActive: false })
    return result
  } catch (error) {
    throw error
  }
}

module.exports = { create, readOne, read, readById, update, del }
