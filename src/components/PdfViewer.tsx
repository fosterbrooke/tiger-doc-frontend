import React from 'react';

import { Document, Page, pdfjs } from 'react-pdf';
import { useState } from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`;

interface PdfPreviewProps {
  pdfBlob: Blob | string;
}

export default function PdfPreview({ pdfBlob }: PdfPreviewProps) {
  const [numPages, setNumPages] = useState<number | null>(null);

  return (
    <div onContextMenu={(e) => e.preventDefault()} className="overflow-auto h-[750px] border rounded shadow">
      <Document
        file={pdfData}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading="Loading PDF..."
        options={{ disableWorker: false }}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={600}
            renderAnnotationLayer={false}
            renderTextLayer={true}
          />
        ))}
      </Document>
    </div>
  );
}