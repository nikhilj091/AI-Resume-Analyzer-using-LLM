const PDFParser = require("pdf2json");
import mammoth from 'mammoth';

export async function parseResume(buffer: Buffer, fileType: string): Promise<string> {
  if (fileType === 'application/pdf') {
    // Validate PDF magic number (%PDF-)
    if (buffer.length < 5 || buffer.toString('utf8', 0, 5) !== '%PDF-') {
      throw new Error("The uploaded file is not a valid PDF document. It appears to be an image or another file type disguised as a PDF.");
    }
  
    return new Promise((resolve, reject) => {
      try {
        const pdfParser = new PDFParser(null, 1);
        
        pdfParser.on("pdfParser_dataError", (errData: any) => {
          console.error("PDF Parsing error:", errData.parserError);
          reject(new Error("Failed to parse PDF resume."));
        });
        
        pdfParser.on("pdfParser_dataReady", () => {
          const rawText = pdfParser.getRawTextContent();
          resolve(rawText);
        });
        
        pdfParser.parseBuffer(buffer);
      } catch (error) {
        console.error("PDF Parsing error:", error);
        reject(new Error("Failed to parse PDF resume."));
      }
    });
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
