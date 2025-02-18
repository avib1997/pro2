// server/routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileService = require('../services/fileService');
const mongoose = require('mongoose'); // ✅ ייבוא mongoose


const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '❌ לא נבחר קובץ להעלאה' });
        }

        const { eventId, userId } = req.body;

        if (!eventId) {
            return res.status(400).json({ error: '❌ חובה לצרף מזהה אירוע' });
        }

        // 🛑 בדיקה האם gridFSBucket מחובר
        if (!global.gridFSBucket) {
            console.error('❌ gridFSBucket לא מחובר ל-MongoDB!');
            return res.status(500).json({ error: '❌ שגיאת שרת: GridFSBucket לא מחובר' });
        }

        const fileData = await fileService.uploadFile(req.file, userId || null, eventId, global.gridFSBucket);

        res.status(201).json({ message: '✅ הקובץ הועלה בהצלחה', file: fileData });
    } catch (error) {
        console.error('❌ שגיאה בהעלאת הקובץ:', error);
        res.status(500).json({ error: '❌ העלאת הקובץ נכשלה' });
    }
});


router.get('/download/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;

    // 🛑 בדיקה אם GridFS מחובר
    if (!global.gridFSBucket) {
      console.error('❌ GridFSBucket לא מחובר!');
      return res.status(500).json({ error: '❌ GridFSBucket לא מחובר ל-MongoDB' });
    }

    // פתיחת זרם לקריאת הקובץ מ-GridFS
    const downloadStream = global.gridFSBucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

    // אם יש שגיאה (למשל קובץ לא נמצא)
    downloadStream.on('error', (err) => {
      console.error('❌ שגיאה בהורדת הקובץ:', err);
      return res.status(404).json({ error: '❌ קובץ לא נמצא ב-GridFS' });
    });

    // קבלת מטא-דאטה של הקובץ כדי להגדיר כותרות HTTP
    const fileMeta = await fileService.getFileMetadata(fileId);
    if (!fileMeta) {
      return res.status(404).json({ error: '❌ לא נמצא מידע על הקובץ' });
    }

    // הגדרת סוג התוכן ושם הקובץ
    res.set('Content-Type', fileMeta.contentType);
    res.set('Content-Disposition', `attachment; filename="${fileMeta.fileName}"`);

    // הזרמת הקובץ ישירות ללקוח
    downloadStream.pipe(res);
  } catch (error) {
    console.error('❌ שגיאה בהורדת הקובץ:', error);
    res.status(500).json({ error: '❌ הורדת הקובץ נכשלה' });
  }
});

router.get('/view/:fileId', async (req, res) => {
    try {
      const { fileId } = req.params;
  
      if (!global.gridFSBucket) {
        console.error('❌ GridFSBucket לא מחובר!');
        return res.status(500).json({ error: '❌ GridFSBucket לא מחובר ל-MongoDB' });
      }
  
      // פתיחת זרם לקריאת הקובץ מ-GridFS
      const downloadStream = global.gridFSBucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
  
      // אם יש שגיאה (למשל קובץ לא נמצא)
      downloadStream.on('error', (err) => {
        console.error('❌ שגיאה בהצגת הקובץ:', err);
        return res.status(404).json({ error: '❌ קובץ לא נמצא ב-GridFS' });
      });
  
      // קבלת מטא-דאטה של הקובץ כדי להגדיר את סוג התוכן
      const fileMeta = await fileService.getFileMetadata(fileId);
      if (!fileMeta) {
        return res.status(404).json({ error: '❌ לא נמצא מידע על הקובץ' });
      }
  
      // ✅ הגדרת הכותרות להצגת קובץ ישירות (ולא להורדה)
      res.set('Content-Type', fileMeta.contentType);
      res.set('Content-Disposition', 'inline'); // הצגה ולא הורדה
  
      // הזרמת הקובץ ישירות לתצוגה
      downloadStream.pipe(res);
    } catch (error) {
      console.error('❌ שגיאה בהצגת הקובץ:', error);
      res.status(500).json({ error: '❌ הצגת הקובץ נכשלה' });
    }
  });
  

/**
 * נתיב לשליפת מטא-דאטה של הקובץ (למשל, להצגת מידע נוסף)
 */
router.get('/:fileId', async (req, res) => {
  try {
    const fileMeta = await fileService.getFileMetadata(req.params.fileId);
    if (!fileMeta) {
      return res.status(404).json({ error: 'הקובץ לא נמצא' });
    }
    res.status(200).json(fileMeta);
  } catch (error) {
    console.error('❌ שגיאה בשליפת מטא-דאטה של הקובץ:', error);
    res.status(500).json({ error: 'שליפת המידע נכשלה' });
  }
});

/**
 * נתיב למחיקת קובץ
 */
router.delete('/:fileId', async (req, res) => {
  try {
    const deleted = await fileService.deleteFile(req.params.fileId, gridFSBucket);
    if (!deleted) {
      return res.status(404).json({ error: 'הקובץ לא נמצא או לא ניתן למחוק אותו' });
    }
    res.status(200).json({ message: 'הקובץ נמחק בהצלחה' });
  } catch (error) {
    console.error('❌ שגיאה במחיקת הקובץ:', error);
    res.status(500).json({ error: 'מחיקת הקובץ נכשלה' });
  }
});

// נתיב בדיקה
router.get('/test', (req, res) => {
  res.json({ message: 'נתיבי הקבצים עובדים!' });
});

module.exports = router;
