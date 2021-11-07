import { ObjectId } from "mongodb";

import { connectToDatabase } from '../../lib/mongodb';

export default async function Handler(req, res) {
  if(req.method === "DELETE") {
    const { id } = req.body;
    console.log( "api/delete" ,id);

    try {
      const { db } = await connectToDatabase();
      const data = await db.collection('userPost').deleteOne({_id: ObjectId(id)});
      console.log("db res", data);
      if(data.deletedCount === 1) {
        return res.status(200).json({msg: 'success'});
      }
      if(data.deletedCount === 0) {
        return res.status(500).json({meg: 'failed to delete.'})
      }
    }
    catch(err) {
      console.log(err);
      return res.status(500).json(err);
    }


  } else if (req.method !== "DELETE") {
    return res.status(405).json({message: "your method is not allowed"})
  }
}