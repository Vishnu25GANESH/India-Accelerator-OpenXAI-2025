"use client";

import { useState } from 'react';
import Viewer from '../components/Viewer';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [contourData, setContourData] = useState<number[][] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!file) {
      alert('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      console.log('Contour data received:', data.contour);
      setContourData(data.contour);
    } catch (error: any) {
      console.error('Error analyzing image:', error);
      setAnalysisResult(error.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="p-4 bg-gray-800 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Prosthetic Designer AI</h1>
      </header>
      <main className="flex-grow p-4 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 bg-gray-800 p-4 rounded-lg flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer mb-4">
            <input type="file" className="hidden" id="file-upload" onChange={handleImageUpload} accept="image/*" />
            <label htmlFor="file-upload" className="cursor-pointer">
              {image ? (
                <img src={image} alt="Uploaded preview" className="mx-auto rounded-lg max-h-64" />
              ) : (
                <p className="text-gray-400">Click to upload an image</p>
              )}
            </label>
          </div>
          <button
            onClick={handleAnalyzeClick}
            disabled={!image || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Image'}
          </button>
          {analysisResult && (
            <div className="mt-4 p-4 bg-gray-700 rounded-lg">
              <h3 className="font-semibold">Analysis Result:</h3>
              <p>{analysisResult}</p>
            </div>
          )}
        </div>
        <div className="w-full md:w-2/3 bg-gray-800 p-4 rounded-lg">
          <Viewer contourData={contourData} />
        </div>
      </main>
    </div>
  );
}
