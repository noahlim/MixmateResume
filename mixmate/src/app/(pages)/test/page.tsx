"use client";
import { useState } from "react";
import { makeRequest } from "@/app/_utilities/_client/utilities"; // Assuming this is the correct path
import { API_ROUTES, REQ_METHODS, S3_BUCKET_URL } from "@/app/_utilities/_client/constants"; // Assuming this is the correct path
import { aws_access_key, aws_secret_key, bucket_name, bucket_region } from '@/app/_utilities/_server/database/config';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [image, setImage] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await makeRequest(
        API_ROUTES.image,
        REQ_METHODS.post,
        formData,
        (response) => {
          console.log(response);
        }
      );
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!fileName) return;
    console.log(bucket_name);
    setUploading(true);

       await setImage(S3_BUCKET_URL(fileName));
        
      setUploading(false);

  }
  const handleDelete = async (e) => {
    e.preventDefault();
    if (!fileName){ return;}

    setUploading(true);

    try {
      await makeRequest(
        API_ROUTES.image,
        REQ_METHODS.delete,
        {filename: fileName},
        (response) => {
          console.log(response);
        }
      );
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  return (
    <>
      <h1>Upload Files to S3 Bucket</h1>

      {/* Upload form */}
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      <img src={!image? "boy.png":image} />
      {/* Fetch form */}
      <form onSubmit={handleFetch}>
        <input
          type="text"
          placeholder="File Name to Fetch"
          onChange={handleFileNameChange}
        />
        <button type="submit" disabled={!fileName || uploading}>
          {uploading ? "Fetching..." : "Fetch"}
        </button>
      </form>
      <form onSubmit={handleDelete}>
        <input
          type="text"
          placeholder="File Name to Delete"
          onChange={handleFileNameChange}
        />
        <button type="submit" disabled={!fileName || uploading}>
          {uploading ? "Deleting..." : "Delete"}
        </button>
      </form>
    </>
  );
};

export default UploadForm;
