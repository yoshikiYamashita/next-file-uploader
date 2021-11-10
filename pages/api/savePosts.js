import { connectToDatabase } from '../../lib/mongodb';
import moment from 'moment';


export default async function handler(req, res) {
  if(req.method === 'POST'){
    try {
      const { filename, title } = req.body;
      if( filename && title ) {
        const { db } = await connectToDatabase();
        const response = await db.collection("userPost").insertOne({
          filename: filename,
          title: title,
          addedAt: moment().format('MMMM Do YYYY, h:mm:ss a')
        });
        return res.json(response);
      }
      else {
        return res.json({ err: "Pass the props." });
      }
    } 
    catch(err) {
      return res.status(500).json(err);
    }
  }
  else if(req.method !== 'POST') {
    return res.status(405).json({message: "your method is not allowed"})
  }
}