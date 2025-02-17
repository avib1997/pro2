// ModernLogo.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'

function ModernLogo() {
  return (
    <Box
      component={Link} // הופך את כל ה־Box ללינק
      to="/"
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column', // טקסט מתחת לאייקון
        alignItems: 'center',
        gap: 0.5,
        cursor: 'pointer',
        transform: 'scale(1)',
        transformOrigin: 'center', // נקודת העיגון (אפשר top left/center וכו')
        transition: 'transform 0.3s ease-in-out',

        // בכל פעם שהמסך יהיה צר מ-600px, נקטין את כל הלוגו ב-20%
        '@media (max-width: 600px)': {
          transform: 'scale(0.8)'
        },
        '&:hover': {
          color: '#ffffff7c',
          transform: 'scale(1.1)',
          transition: 'transform 0.3s, color 0.3s'
        }
      }}
    >
      <CardGiftcardIcon fontSize="medium" />

      <Typography
        variant="body2"
        sx={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 700,
          letterSpacing: '.3rem',
          textTransform: 'uppercase'
        }}
      >
        Easy Gift
      </Typography>
    </Box>
  )
}

export default ModernLogo
