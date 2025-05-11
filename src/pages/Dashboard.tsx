import React, { useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { renderAsync } from 'docx-preview';

export default function Dashboard() {
  const [isLoading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mode, setMode] = useState('l500_chamber');
  const [convertedBlob, setConvertedBlob] = useState<ArrayBuffer | null>(null);
  const [error, setError] = useState('');
  const [scale, setScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const viewerRef = useRef(null);
  const previewContainerRef = useRef(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (!file.name.endsWith('.docx')) {
        setError("Please upload a valid .docx file");
        return;
      }
      setSelectedFile(file);
      setConvertedBlob(null);
      setError('');
      toast.success('File selected successfully!');
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('mode', mode);

    try {
      setLoading(true);
      toast.info('Converting file...');

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/process/convert`, formData, {
        responseType: 'arraybuffer',
      });

      setConvertedBlob(response.data);
      toast.success('File converted successfully!');
      
      if (viewerRef.current) {
        await renderAsync(response.data, viewerRef.current, null, {
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          ignoreFonts: false,
          breakPages: true,
        });
        
        const pages = viewerRef.current.querySelectorAll('.docx-page');
        setTotalPages(pages.length);
        setCurrentPage(1);
        scrollToPage(1);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to convert file');
      setError('Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  const scrollToPage = (pageNumber: number) => {
    if (!viewerRef.current) return;
    
    const pages = viewerRef.current.querySelectorAll('.docx-page');
    if (pages.length === 0 || pageNumber < 1 || pageNumber > pages.length) return;
    
    const page = pages[pageNumber - 1];
    if (previewContainerRef.current) {
      previewContainerRef.current.scrollTo({
        top: page.offsetTop - previewContainerRef.current.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      scrollToPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      scrollToPage(currentPage + 1);
    }
  };

  return (
    <div className="w-full flex p-8 h-screen bg-gray-50">
      {/* Left Panel - Controls */}
      <div className="w-1/3 p-6 bg-white rounded-xl shadow-md overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Document Converter</h1>

        {/* Conversion Mode */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Conversion Mode</h2>
          <div className="space-y-3">
            <label className="flex items-center p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-blue-600"
                checked={mode === 'l500_chamber'}
                onChange={() => setMode('l500_chamber')}
              />
              <span className="ml-3 text-gray-800">L500 to Chamber</span>
            </label>
            <label className="flex items-center p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-blue-600"
                checked={mode === 'chamber_l500'}
                onChange={() => setMode('chamber_l500')}
              />
              <span className="ml-3 text-gray-800">Chamber to L500</span>
            </label>
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <h3 className="text-md font-medium mb-3 text-gray-700">Upload Document</h3>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center transition hover:border-blue-400 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center py-4">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/869/869869.png" 
                alt="Upload" 
                className="h-12 w-12 mb-3 opacity-70"
              />
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">DOCX files only</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".docx"
            />
          </div>
          {selectedFile && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg flex items-center">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/136/136521.png" 
                alt="Word file" 
                className="h-6 w-6 mr-2"
              />
              <span className="text-sm text-gray-700 truncate">{selectedFile.name}</span>
            </div>
          )}
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          disabled={!selectedFile || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg shadow-md transition disabled:opacity-50 flex justify-center items-center"
        >
          {isLoading ? (
            <>
              <Spinner className="mr-2" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
              </svg>
              <span>Convert Document</span>
            </>
          )}
        </button>
      </div>

      {/* Right Panel - Preview */}
      <div className="w-2/3 p-4 flex flex-col">
        <div className="bg-white rounded-xl shadow-md flex-grow flex flex-col">
          {/* Preview Controls */}
          <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
            <div className="flex space-x-2">
              <button 
                onClick={handleZoomOut}
                className="p-2 bg-white border rounded-lg hover:bg-gray-100 transition shadow-sm"
                disabled={!convertedBlob}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                </svg>
              </button>
              <span className="px-3 py-1 bg-white border rounded-lg text-sm shadow-sm flex items-center">
                {Math.round(scale * 100)}%
              </span>
              <button 
                onClick={handleZoomIn}
                className="p-2 bg-white border rounded-lg hover:bg-gray-100 transition shadow-sm"
                disabled={!convertedBlob}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={handlePrevPage}
                className="p-2 bg-white border rounded-lg hover:bg-gray-100 transition shadow-sm"
                disabled={!convertedBlob || currentPage <= 1}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={handleNextPage}
                className="p-2 bg-white border rounded-lg hover:bg-gray-100 transition shadow-sm"
                disabled={!convertedBlob || currentPage >= totalPages}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
            
            <button
              onClick={() => {
                if (convertedBlob) {
                  const blob = new Blob([convertedBlob], {
                    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  });
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', `converted_${selectedFile?.name || 'document.docx'}`);
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                  toast.success('File downloaded!');
                }
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition flex items-center disabled:opacity-50"
              disabled={!convertedBlob}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Download
            </button>
          </div>

          {/* Preview Content */}
          <div 
            ref={previewContainerRef}
            className="flex-grow overflow-auto bg-gray-100 relative"
            style={{ height: 'calc(100vh - 200px)' }}
          >
            <div 
              ref={viewerRef}
              style={{
                transform: `scale(${scale})`,
                transformOrigin: '0 0',
                width: `${100 / scale}%`,
                height: `${100 / scale}%`,
                padding: '20px'
              }}
            >
              {!convertedBlob && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p className="text-lg">Convert a document to see the preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}