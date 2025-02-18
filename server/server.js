const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const router = require('./routes');
const { GridFSBucket } = require('mongodb');

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// 🛑 הגדרת `gridFSBucket` כמשתנה **גלובלי**
global.gridFSBucket = null;

const connectDB = async () => {
  
  try {
    await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ MongoDB Connected Successfully');

    // יצירת GridFSBucket **ונשמור אותו כמשתנה גלובלי**
    global.gridFSBucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    console.log('✅ GridFSBucket מוכן לשימוש');
  } catch (error) {
    console.error('❌ Error Connecting to MongoDB:', error);
    process.exit(1);
  }
};

connectDB();

// Routes - חיבור כל הנתיבים
app.use('/api', router);
const routes = require("./routes/index");


// דף שגיאה לנתיבים לא מוכרים
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// הפעלת השרת
const PORT = process.env.PORT || 2001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

