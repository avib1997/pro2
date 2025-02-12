import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Box, Typography, Paper, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Backdrop, CircularProgress } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import dayjs from 'dayjs'
import 'dayjs/locale/he'

dayjs.locale('he')

const Admin = () => {
  const [users, setUsers] = useState([])
  const [events, setEvents] = useState([])
  const [gifts, setGifts] = useState([])
  const [loading, setLoading] = useState(true)
  const usersRef = useRef([])
  const eventsRef = useRef([])
  const giftsRef = useRef([])

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      const [usersRes, eventsRes, giftsRes] = await Promise.all([
        axios.get('http://localhost:2001/api/users'),
        axios.get('http://localhost:2001/api/events/getAll'),
        axios.get('http://localhost:2001/api/gift/getAllGifts')
      ])

      if (JSON.stringify(usersRes.data) !== JSON.stringify(usersRef.current)) {
        setUsers(usersRes.data)
        usersRef.current = usersRes.data
      }
      if (JSON.stringify(eventsRes.data) !== JSON.stringify(eventsRef.current)) {
        setEvents(eventsRes.data)
        eventsRef.current = eventsRes.data
      }
      if (JSON.stringify(giftsRes.data) !== JSON.stringify(giftsRef.current)) {
        setGifts(giftsRes.data)
        giftsRef.current = giftsRes.data
      }
    } catch (error) {
      console.error('❌ Error fetching data:', error)
    }
    setLoading(false)
  }

  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      <Typography variant="h3" sx={{ mb: 2 }}>
        ניהול משתמשים, אירועים ומתנות
      </Typography>
      {loading ? (
        <CircularProgress color="primary" />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                משתמשים
              </Typography>
              <DataGrid rows={users} getRowId={row => row._id} columns={[]} pageSize={5} components={{ Toolbar: GridToolbar }} />
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default Admin
