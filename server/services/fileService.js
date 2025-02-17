// server/services/fileService.js
const streamifier = require('streamifier');
const File = require('../models/fileModel');
const mongoose = require('mongoose');

async function uploadFile(file, userId, eventId) {
    return new Promise((resolve, reject) => {
        try {
            console.log('📤 קובץ שמתקבל ל-uploadFile:', file);
            console.log('📤 מזהה משתמש:', userId);
            console.log('📤 מזהה אירוע:', eventId);
            console.log('📤 GridFSBucket קיים?', !!global.gridFSBucket);

            // 🛑 בדיקה האם GridFS מחובר
            if (!global.gridFSBucket) {
                console.error('❌ GridFSBucket לא מחובר!');
                return reject(new Error('GridFSBucket לא מחובר'));
            }

            // פתיחת זרם להעלאת קובץ ל-GridFS
            const uploadStream = global.gridFSBucket.openUploadStream(file.originalname, {
                contentType: file.mimetype,
            });

            streamifier.createReadStream(file.buffer)
                .pipe(uploadStream)
                .on('error', (error) => {
                    console.error('❌ שגיאה בהעלאת הקובץ ל-GridFS:', error);
                    reject(error);
                })
                .on('finish', async () => {
                    try {
                        console.log('✅ קובץ נשמר ב-GridFS עם ID:', uploadStream.id);

                        const fileDoc = new File({
                            fileId: uploadStream.id,
                            fileName: file.originalname,
                            fileType: file.mimetype.split('/')[0],
                            fileSize: file.size,
                            contentType: file.mimetype,
                            userid_file: userId || null,
                            EventId: eventId || null,
                            uploadDate: new Date(),
                        });

                        const savedFile = await fileDoc.save();
                        console.log('✅ הקובץ נשמר במסד הנתונים:', savedFile);
                        resolve(savedFile);
                    } catch (err) {
                        console.error('❌ שגיאה בשמירת פרטי הקובץ במסד הנתונים:', err);
                        reject(err);
                    }
                });
        } catch (error) {
            console.error('❌ שגיאה כללית בהעלאת הקובץ:', error);
            reject(error);
        }
    });
}


  


function downloadFile(fileId, res, gridFSBucket) {
  try {
    const _id = new ObjectId(fileId);
    const downloadStream = gridFSBucket.openDownloadStream(_id);
    downloadStream.on('error', (err) => {
      res.status(404).json({ error: 'הקובץ לא נמצא' });
    });
    // ניתן להגדיר כאן כותרות (headers) בהתאם ל-contentType אם רוצים
    downloadStream.pipe(res);
  } catch (error) {
    res.status(400).json({ error: 'ID לא תקין' });
  }
}

async function getFileMetadata(fileId) {
    console.log('🔍 מזהה הקובץ לשליפת מטא-דאטה:', fileId);
    try {
      if (!mongoose.Types.ObjectId.isValid(fileId)) {
        throw new Error('❌ מזהה הקובץ לא תקין');
      }
      return await File.findOne({ fileId: new mongoose.Types.ObjectId(fileId) });
    } catch (error) {
      console.error('❌ שגיאה בשליפת מטא-דאטה:', error);
      return null;
    }
  }


async function deleteFile(fileId, gridFSBucket) {
  try {
    const _id = new ObjectId(fileId);
    await gridFSBucket.delete(_id);
    const result = await File.deleteOne({ fileId: _id });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

module.exports = {
  uploadFile,
  downloadFile,
  getFileMetadata,
  deleteFile,
};
