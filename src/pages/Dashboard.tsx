import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import PdfPreview from '../components/PdfViewer';

export default function Dashboard() {
  const [isLoading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mode, setMode] = useState('l500_chamber');
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setPreviewBlob(null); // Reset preview on new file
    }
  };

  const handleUploadForPreview = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('mode', mode);

    try {
      setLoading(true);
      toast.info('Generating PDF preview...');

      const response = await axios.post('http://localhost:8000/process/convert?preview=true', formData, {
        responseType: 'blob',
      });

      const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setPreviewBlob(new Blob([response.data], { type: 'application/pdf' })); // Save preview
      toast.success('Preview ready!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate preview');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocx = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('mode', mode);

    try {
      setLoading(true);
      toast.info('Downloading DOCX...');

      const response = await axios.post('http://localhost:8000/process/convert?download=true', formData, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'converted.docx');
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('DOCX downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to download DOCX');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex p-16 items-center">
      <div className="w-1/2 flex flex-col items-center">
        <div className="text-[28px] font-bold text-center">Please choose an option</div>

        <div className="flex items-center mt-8">
          <input
            id="l500-to-chamber-radio"
            type="radio"
            name="conversion-mode"
            className="w-4 h-4 text-blue-600"
            checked={mode === 'l500_chamber'}
            onChange={() => setMode('l500_chamber')}
          />
          <label htmlFor="l500-to-chamber-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            L500 to Chamber
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="chamber-to-l500-radio"
            type="radio"
            name="conversion-mode"
            className="w-4 h-4 text-blue-600"
            checked={mode === 'chamber_l500'}
            onChange={() => setMode('chamber_l500')}
          />
          <label htmlFor="chamber-to-l500-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Chamber to L500
          </label>
        </div>

        <div className="flex items-center justify-center w-full mt-4">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">DOCX files only</p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleUploadForPreview}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition hover:cursor-pointer disabled:bg-gray-300 disabled:text-gray-700 disabled:cursor-not-allowed flex gap-x-2"
            disabled={!selectedFile || isLoading}
          >
            {isLoading && <Spinner />}
            Convert and Download
          </button>
        </div>
      </div>
      <div className="w-1/2">
        {/* Preview Panel */}
        {<PdfPreview pdfBlob={"/sample.pdf"} />}
      </div>
    </div>
  );
}
