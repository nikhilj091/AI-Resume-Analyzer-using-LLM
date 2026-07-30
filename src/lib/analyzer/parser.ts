// Polyfill for Next.js 15 server environment to prevent pdf-parse ReferenceError
if (typeof global !== 'undefined') {
  if (typeof (global as any).DOMMatrix === 'undefined') {
    (global as any).DOMMatrix = class DOMMatrix {};
  }
  if (typeof (global as any).ImageData === 'undefined') {
    (global as any).ImageData = class ImageData {};
  }
  if (typeof (global as any).Path2D === 'undefined') {
    (global as any).Path2D = class Path2D {};
  }
}

const pdfParse = require('pdf-parse');
import mammoth from 'mammoth';

export async function parseResume(buffer: Buffer, fileType: string): Promise<string> {
  if (fileType === 'application/pdf') {
    try {
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      console.error("PDF Parsing error:", error);
      throw new Error("Failed to parse PDF resume.");
    }
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (error) {
      console.error("DOCX Parsing error:", error);
      throw new Error("Failed to parse DOCX resume.");
    }
  } else {
    throw new Error("Unsupported file format. Please upload a PDF or DOCX.");
  }
}
