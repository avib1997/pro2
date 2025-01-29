import React, { useState, useContext } from 'react'
import { Context } from '../../App'
import axios from 'axios'
import EventForm from './EventForm'

const AddEvent = () => {
  const { IsEvent, setIsEvent, userId } = useContext(Context)
  const [error, setError] = useState(null)
  const [input, setInput] = useState({
    NameOfGroom: '',
    NameOfBride: '',
    NameOfManager: '',
    Event_number: Math.floor(1000 + Math.random() * 9000), // מספר אירוע אוטומטי
    TypeOfEvent: '',
    phone: '',
    DateOfEvent: '',
    NumOfGuests: ''
  })

  const handleInputChange = e => {
    setInput(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handleAddEventClick = async e => {
    e.preventDefault()

    if (!input.TypeOfEvent || !input.DateOfEvent || !input.phone) {
      alert('אנא מלא את כל השדות החיוניים')
      return
    }

    const newEvent = { ...input, userid_event: userId }

    try {
      const res = await axios.post('http://localhost:2001/api/events/addEvent', newEvent)
      console.log('✅ אירוע נוסף:', res.data)
      setIsEvent(!IsEvent)
    } catch (error) {
      console.error('❌ Error adding event:', error)
    }
  }

  return (
    <>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <EventForm input={input} handleInputChange={handleInputChange} handleAddEventClick={handleAddEventClick} />
    </>
  )
}

export default AddEvent
