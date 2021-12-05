import { ObjectId } from "mongodb";

import Image from 'next/image';
import Link from 'next/link';

import { connectToDatabase } from "../../lib/mongodb";


export const getStaticPaths = async () => {
  const { db } = await connectToDatabase();
  const data = await db.collection("userPost").find({}).toArray();
  const parsed = JSON.parse(JSON.stringify(data));
  const paths = parsed.map((post) => {
    return {
      params: {
        id: post._id.toString()
      }
    }
  });
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps(context) {
  const id = context.params.id;
  const { db } = await connectToDatabase();
  const data = await db.collection("userPost").findOne({ "_id": ObjectId(id) });
  const userPost = JSON.parse(JSON.stringify(data));
  return {
    props: {
      userPost: userPost
    },
  }
}


export default function Details({ userPost }) {
  return (
    <>
      <Link href="/"><a>Back to Home</a></Link>
      <h1>path: /details/{userPost._id}</h1>
      <h1>title: {userPost.title}</h1>
      <h1>filename: {userPost.filename}</h1>
      <h1>added at {userPost.addedAt}</h1>
      <Image
        src={`/uploads/${userPost.filename}`} 
        alt='image'
        width={250}
        height={250}
      />
    </>
  )
}