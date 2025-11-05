// Color contrast checker for WCAG AAA compliance
const colors = {
  light: {
    background: '#FEFCF8',
    textPrimary: '#1A1410',
    textSecondary: '#4A3F35',
    textTertiary: '#6B5F52',
  },
  dark: {
    background: '#0F0D0A',
    textPrimary: '#F9F3E6',
    textSecondary: '#D4C4A0',
    textTertiary: '#B8A88C',
  }
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getContrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1)
  const rgb2 = hexToRgb(hex2)
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

function getComplianceLevel(ratio) {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  return 'FAIL'
}

console.log('WCAG Contrast Ratio Verification\n')
console.log('WCAG AA: 4.5:1 for normal text, 3:1 for large text')
console.log('WCAG AAA: 7:1 for normal text, 4.5:1 for large text\n')

console.log('LIGHT MODE:')
const lightPrimary = getContrastRatio(colors.light.textPrimary, colors.light.background)
const lightSecondary = getContrastRatio(colors.light.textSecondary, colors.light.background)
const lightTertiary = getContrastRatio(colors.light.textTertiary, colors.light.background)

console.log(`Text Primary on Background: ${lightPrimary.toFixed(2)}:1 (${getComplianceLevel(lightPrimary)})`)
console.log(`Text Secondary on Background: ${lightSecondary.toFixed(2)}:1 (${getComplianceLevel(lightSecondary)})`)
console.log(`Text Tertiary on Background: ${lightTertiary.toFixed(2)}:1 (${getComplianceLevel(lightTertiary)})`)

console.log('\nDARK MODE:')
const darkPrimary = getContrastRatio(colors.dark.textPrimary, colors.dark.background)
const darkSecondary = getContrastRatio(colors.dark.textSecondary, colors.dark.background)
const darkTertiary = getContrastRatio(colors.dark.textTertiary, colors.dark.background)

console.log(`Text Primary on Background: ${darkPrimary.toFixed(2)}:1 (${getComplianceLevel(darkPrimary)})`)
console.log(`Text Secondary on Background: ${darkSecondary.toFixed(2)}:1 (${getComplianceLevel(darkSecondary)})`)
console.log(`Text Tertiary on Background: ${darkTertiary.toFixed(2)}:1 (${getComplianceLevel(darkTertiary)})`)

console.log('\n=== COMPLIANCE SUMMARY ===')
console.log(`Light Mode Primary: ${getComplianceLevel(lightPrimary)} ${lightPrimary >= 7 ? '✓' : lightPrimary >= 4.5 ? '✓' : '✗'}`)
console.log(`Light Mode Secondary: ${getComplianceLevel(lightSecondary)} ${lightSecondary >= 7 ? '✓' : lightSecondary >= 4.5 ? '✓' : '✗'}`)
console.log(`Light Mode Tertiary: ${getComplianceLevel(lightTertiary)} ${lightTertiary >= 4.5 ? '✓' : '✗'}`)
console.log(`Dark Mode Primary: ${getComplianceLevel(darkPrimary)} ${darkPrimary >= 7 ? '✓' : darkPrimary >= 4.5 ? '✓' : '✗'}`)
console.log(`Dark Mode Secondary: ${getComplianceLevel(darkSecondary)} ${darkSecondary >= 7 ? '✓' : darkSecondary >= 4.5 ? '✓' : '✗'}`)
console.log(`Dark Mode Tertiary: ${getComplianceLevel(darkTertiary)} ${darkTertiary >= 4.5 ? '✓' : '✗'}`)
