import { useState, useEffect } from 'react';
import axios from 'axios';

import Image from 'next/image'
import Link from 'next/link';

import { connectToDatabase } from '../lib/mongodb';


export async function getStaticProps(context) {
  const { db } = await connectToDatabase();
  const data = await db.collection("userPost").find({}).toArray();
  const properties = JSON.parse(JSON.stringify(data));
  return {
    props: {
      properties: properties,
    },
  }
}


export default function Home({ properties }) {

  const [storedFiles, setStoredFiles] = useState(properties);
  const [file, setFile] = useState('');
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState(false);

  const fileInputOnChangeHandler = e => setFile(e.target.files[0]);
  const textInputOnChangeHandler = e => setText(e.target.value);

  useEffect(() => {
    console.log('useEffect ran');
  }, [storedFiles])


  const onSubmitHandler = async e => {
    e.preventDefault();
    console.log("submit", file, text);

    // upload
    const formData = new FormData();
    formData.append('image', file);
    const res1 = await axios.post('/api/upload', formData, { 
      headers: { 'Content-Type': 'multipart/form-data', },
    });
    const { filename } = await res1.data;
    setFileName(filename);

    // save in db
    const res2 = await axios.post('/api/savePosts', {
      filename: filename,
      title: text
    });

    // refresh list
    const res3 = await axios.get('/api/getList');
    setStoredFiles(res3.data);
  }

  const deleteHandler = async (e) => {
    const id = e.target.parentNode.id;
    const filename = e.target.parentNode.dataset.filename;
    const res = await axios.delete('/api/delete', {
      data: {
        id: id,
        filename: filename
      } 
    });
    if(res.status === 200) {
      //refresh the list
      const res3 = await axios.get('/api/getList');
      setStoredFiles(res3.data);
    }
  }


  return (
    <>
      <h1>Image Uploader</h1>
      <form onSubmit={(e) => onSubmitHandler(e)}>
        <input type="file" name="image" id="file" required onChange={e => fileInputOnChangeHandler(e)} />
        <label htmlFor="title">title</label>
        <input type="text" name="title" id="title" required onChange={e => textInputOnChangeHandler(e)} />
        <button>Submit</button>
      </form>
      {fileName ? (
        <div>
          <h4>filename: {fileName}</h4>
          <Image
            src={`/uploads/${fileName}`} 
            alt="image"
            width={250}
            height={250}
          />
        </div>
      ):(
        <h4>uploaded file is gonna be showen down here</h4>
      )}
      {storedFiles.length ? (
        <>
          <h3>Image List</h3>
          <ul>
            {storedFiles.map((file) => {
              return (
                <li key={file._id} id={file._id} data-filename={file.filename}>
                  <Link href={`/details/${file._id}`}>
                    <a>title: {file.title}</a>
                  </Link>
                  <button onClick={(e) => deleteHandler(e)}>Delete</button>
                </li>
              )
            })}
          </ul>
        </>
      ): (
        <h1>No files have uploaded yet</h1>
      )}
    </>
  )
}
