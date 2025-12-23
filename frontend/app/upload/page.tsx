"use client";
import React, { useRef, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const filters = [
  { name: 'None', value: '' },
  { name: 'Grayscale', value: 'grayscale(1)' },
  { name: 'Sepia', value: 'sepia(1)' },
  { name: 'Brightness', value: 'brightness(1.5)' },
  { name: 'Contrast', value: 'contrast(2)' },
];

export default function MediaUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [filter, setFilter] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('media', file);
    const res = await axios.post(`${API_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setUploadUrl(res.data.url);
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Upload Media</h1>
      <input type="file" accept="image/*,video/*" ref={inputRef} onChange={handleFileChange} />
      {preview && (
        <div className="mt-4">
          <div className="mb-2">Preview:</div>
          <img src={preview} alt="preview" style={{ maxWidth: '100%', filter }} />
          <div className="mt-2 flex gap-2">
            {filters.map(f => (
              <button key={f.name} onClick={() => setFilter(f.value)} className={filter === f.value ? 'font-bold underline' : ''}>{f.name}</button>
            ))}
          </div>
        </div>
      )}
      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={handleUpload} disabled={!file}>Upload</button>
      {uploadUrl && (
        <div className="mt-4 text-green-600">Uploaded! URL: <a href={uploadUrl} target="_blank" rel="noopener noreferrer">{uploadUrl}</a></div>
      )}
    </div>
  );
}
