import { ObjectId } from "mongodb";
import fs from "fs";

import { connectToDatabase } from '../../lib/mongodb';

export default async function Handler(req, res) {
  if(req.method === "DELETE") {
    const { id, filename } = req.body

    try {
      const { db } = await connectToDatabase();
      const result = await db.collection('userPost').deleteOne({ _id: ObjectId(id) });

      if (result.deletedCount === 1) {
        fs.unlinkSync(`./public/uploads/${filename}`, (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json(err)
          }
        });
        return res.status(200).json({msg: 'success'});
      }
      if (result.deletedCount === 0) {
        return res.status(500).json({ meg: 'failed to delete. '})
      }
    }
    catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  } else if (req.method !== "DELETE") {
    return res.status(405).json({ message: "your method is not allowed" })
  }
}