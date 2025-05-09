import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure the PDF.js worker from the CDN
pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`;

export default function PdfPreview() {
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  useEffect(() => {
    // Fetch the PDF file from the public folder and store as a Blob
    fetch('/sample.pdf')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then((blob) => setPdfBlob(blob))
      .catch((error) => console.error('Error fetching PDF:', error));
  }, []);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="overflow-auto h-[750px] border rounded shadow"
    >
      {pdfBlob ? (
        <Document
          file={pdfBlob}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<span>Loading PDF...</span>}
        >
          {Array.from({ length: numPages }).map((_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={600}
              renderAnnotationLayer={false}
              renderTextLayer={true}
            />
          ))}
        </Document>
      ) : (
        <span>Loading PDF data...</span>
      )}
    </div>
  );
}
