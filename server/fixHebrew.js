function fixHebrewText(text, icon = '') {
  return text.split('').reverse().join('') + icon
}

module.exports = { fixHebrewText }
