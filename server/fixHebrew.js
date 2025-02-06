export function fixHebrewText(text, icon = '') {
  return `${icon} ${text.split('').reverse().join('')}`
}
