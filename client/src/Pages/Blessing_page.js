import CheckCircleIcon from '@mui/icons-material/CheckCircle' // אייקון להצלחה
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined' // אייקון העתקה מודרני יותר
import { Box, Container, Grid, IconButton, List, ListItem, Paper, Tooltip, Typography } from '@mui/material'
import { keyframes, styled } from '@mui/material/styles'
import React, { useState } from 'react'

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`

// סגנון מותאם אישית ל-IconButton
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  transition: 'transform 0.2s',
  '&:hover': {
    animation: `${pulse} 0.6s infinite`
  }
}))

export default function BlessingsPage() {
  const blessings = [
    { id: 1, text: 'מזל טוב! שתזכו לשנים רבות של אושר ואהבה.' },
    {
      id: 2,
      text: 'איחולים חמים ליום הנפלא שלכם. שתהיו תמיד מוקפים באהבה ושמחה.'
    },
    { id: 3, text: 'שפע ברכות ואיחולים ליום המיוחד שלכם.' },
    {
      id: 4,
      text: 'שתהיו תמיד מאושרים יחד, ותזכו להגשים את כל חלומותיכם המשותפים.'
    },
    { id: 5, text: 'אהבה ואושר אינסופיים לכל חייכם.' },
    {
      id: 6,
      text: 'מזל טוב והרבה הצלחה בהמשך הדרך. שתמיד תהיו מוקפים בחברים ומשפחה.'
    },
    { id: 7, text: 'שפע של אהבה ושמחה בכל יום ויום.' },
    {
      id: 8,
      text: 'שתזכו לכל הטוב שבעולם ושתמיד תהיו מאוחדים ומאושרים.'
    },
    { id: 9, text: 'ברכות חמות ואיחולים לבביים ליום הנפלא שלכם.' },
    {
      id: 10,
      text: 'שתהיו מוקפים באהבה ואושר תמיד, ושתגשימו את כל משאלות לבכם.'
    },
    { id: 11, text: 'מזל טוב ליום המיוחד שלכם. אהבה אינסופית.' },
    {
      id: 12,
      text: 'שתמיד תהיו מאושרים ומלאי שמחה, ותזכו לשנים רבות של אושר.'
    },
    { id: 13, text: 'איחולים חמים לאירוע המרגש שלכם.' },
    {
      id: 14,
      text: 'שפע ברכות ליום הנפלא הזה. שתהיו תמיד מוקפים באהבה.'
    },
    { id: 15, text: 'אהבה ואושר לכל חייכם המשותפים.' },
    {
      id: 16,
      text: 'שתזכו לשנים רבות של שמחה ואהבה, ושתמיד תצעדו יחד בדרך החיים.'
    },
    { id: 17, text: 'מזל טוב והרבה הצלחה בעתיד המשותף שלכם.' },
    {
      id: 18,
      text: 'שתהיו תמיד מוקפים בחברים ומשפחה שאוהבים אתכם.'
    },
    { id: 19, text: 'שפע של בריאות ואושר לכל חייכם.' },
    {
      id: 20,
      text: 'ברכות חמות ואיחולים ליום המיוחד שלכם. שתמיד תהיו מאושרים.'
    },
    { id: 21, text: 'שתמיד תהיו מאוחדים ומאושרים בכל אשר תפנו.' },
    {
      id: 22,
      text: 'מזל טוב ואיחולים חמים מכל הלב. שתזכו לכל הטוב שבעולם.'
    },
    { id: 23, text: 'שפע של אהבה, שמחה והצלחה בכל צעד.' },
    {
      id: 24,
      text: 'שתזכו להגשים את כל חלומותיכם ותמיד תהיו מוקפים באהבה.'
    },
    { id: 25, text: 'ברכות ליום הנפלא שלכם. אהבה ושמחה תמידית.' }
  ]

  const [copiedBlessingId, setCopiedBlessingId] = useState(null)

  const copyToClipboard = (id, text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedBlessingId(id)
        setTimeout(() => {
          setCopiedBlessingId(null)
        }, 2000) // משך הזמן להצגת ההודעה
      })
      .catch(err => {
        console.error('שגיאה בהעתקת הטקסט:', err)
      })
  }

  return (
    <div dir="rtl">
      <Box
        sx={{
          paddingTop: '100px',
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          height: '350%',
          zIndex: -1,
          background: 'linear-gradient(135deg, #1B263B, #1B263B)',
          backgroundSize: '400% 400%',
          animation: 'animateBg 15s ease infinite'
        }}
      />
      <Typography
        variant="h3"
        gutterBottom
        align="center"
        sx={{
          fontWeight: 'bold',
          fontFamily: 'Roboto, sans-serif',
          marginTop: '200px',
          marginBottom: '100px',
          color: '#1976D2'
        }}
      >
        ברכות
      </Typography>
      <Container
        maxWidth="lg"
        sx={{
          marginTop: '30px',
          marginBottom: '50px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: 'Roboto, sans-serif'
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: '100%',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)',
            background: 'linear-gradient(135deg, #1B263B, #415A77)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'scale(1.01)',
              background: 'linear-gradient(135deg, #1B263B,rgb(81, 113, 148))',
              boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.3)'
            },
            marginBottom: '30px'
          }}
        >
          <Box sx={{ width: '100%' }}>
            <List>
              {blessings.map(blessing => (
                <Paper
                  key={blessing.id}
                  elevation={3}
                  sx={{
                    marginBottom: '20px',
                    borderRadius: '15px',
                    overflow: 'hidden'
                  }}
                >
                  <ListItem
                    sx={{
                      background: 'linear-gradient(135deg, rgb(100, 130, 160), rgb(140, 180, 220))',
                      '&:before': {
                        display: 'none'
                      }
                    }}
                  >
                    <Grid container alignItems="center">
                      <Grid item xs={11}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: '1.1rem',
                            textAlign: 'right',
                            fontWeight: 'bold',
                            color: '#0d47a1'
                          }}
                        >
                          {blessing.id}. {blessing.text}
                        </Typography>
                      </Grid>
                      <Grid item xs={1} textAlign="left">
                        <Tooltip title={copiedBlessingId === blessing.id ? 'הועתק!' : 'העתק'} arrow placement="top">
                          <StyledIconButton edge="end" aria-label="העתק" onClick={() => copyToClipboard(blessing.id, blessing.text)}>
                            {copiedBlessingId === blessing.id ? (
                              <CheckCircleIcon sx={{ color: '#00E676', fontSize: '2rem' }} />
                            ) : (
                              <ContentCopyOutlinedIcon sx={{ color: '#0d47a1', fontSize: '1.8rem' }} />
                            )}
                          </StyledIconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </ListItem>
                </Paper>
              ))}
            </List>
          </Box>
        </Paper>
      </Container>
    </div>
  )
}
