// ModernColorfulUserIcon.jsx

import React from 'react'
import { SvgIcon } from '@mui/material'

function ModernColorfulUserIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 64 64">
      {/* הגדרת גרדיאנט צבעוני */}
      <defs>
        <linearGradient id="gradientUser" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1A73E8" /> {/* כחול עמוק יותר */}
          <stop offset="100%" stopColor="#74b9ff" /> {/* תכלת בהיר */}
        </linearGradient>
      </defs>

      {/* רקע מעגלי עם גראדיאנט */}
      <circle cx="32" cy="32" r="30" fill="url(#gradientUser)" />

      {/* סילואט של ראש וכתפיים בלבן (ניתן לשנות לצבע אחר) */}
      <path
        fill="#ECEFF1"
        d="
          M32,17
          c-5.5,0-10,4.5-10,10
          s4.5,10,10,10
          s10-4.5,10-10
          S37.5,17,32,17
          Z
          M21,41
          c-2.8,2.7-5,6.3-5,11
          h32
          c0-4.7-2.2-8.3-5-11
          c-2.7-2.6-6.3-4-10-4
          S23.7,38.4,21,41
          Z
        "
      />
    </SvgIcon>
  )
}

export default ModernColorfulUserIcon
