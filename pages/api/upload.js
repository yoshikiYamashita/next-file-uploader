import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';


export const config = {
  api: {
    bodyParser: false, 
    externalResolver: true,
  },
}

const upload =  multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => cb(null, `${uuidv4().toString()}-${moment().format('MM-DD-YYYY-h:mm-a')}-${file.originalname}`),
  }),
}).single('image');


export default async function handler(req, res) {
  if(req.method === 'POST') {
    try {
      upload(req, res, function (err) {
        if (err) {
          console.log(err);
          return res.status(500).json(err);
        }
        const file = req.file;
        console.log("new file added", req.file);
        return res.json({ filename: file.filename });
      });
    }
    catch(err) {
      return res.status(500).json(err);
    }
  } else if (req.method !== 'POST') {
    return res.status(405).json({message: "your method is not allowed"})
  }
}