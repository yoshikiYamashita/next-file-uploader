import { connectToDatabase } from '../../lib/mongodb';


export default async function handler(req, res) {
  if(req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      const data = await db.collection("userPost").find({}).toArray();
      const parsed = JSON.parse(JSON.stringify(data));
      return res.json(parsed);
    }
    catch(err) {
      return res.status(500).json(err);
    }
  } else if(req.method !== 'GET') {
    return res.status(405).json({message: "your method is not allowed"})
  }
}