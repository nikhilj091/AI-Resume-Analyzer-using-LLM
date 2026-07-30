# AI Resume Analyzer

A production-ready, full-stack AI-powered Resume Analyzer built with Next.js (App Router), Tailwind CSS, shadcn/ui, and the Google Gemini API.

## Project Overview

The AI Resume Analyzer allows job seekers to upload their resume (PDF or DOCX), choose a target role and company, and instantly receive:
- Deterministic ATS Compatibility Score (0–100)
- Formatting analysis (bullet points, length, required sections)
- Keyword and technical skill matching using NLP and TF-IDF cosine similarity
- AI-generated feedback including strengths, weaknesses, and actionable suggestions
- Best-fit career recommendations

This is designed as a single Next.js application, making it lightweight, scalable, and immediately deployable to Vercel.

## Architecture & Tech Stack

- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS + shadcn/ui (Radix Primitives)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Parsing**: `pdf-parse` for PDFs, `mammoth` for DOCX
- **NLP**: `natural` for TF-IDF, `stopword` for text cleaning, `compromise` for NER/Skill extraction
- **AI**: `@google/generative-ai` (Gemini API)

## Folder Structure

```
resume-analyzer/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── actions/         # Server Actions (analyze.ts)
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout & ThemeProvider
│   │   └── page.tsx         # Main Landing Page
│   ├── components/          # React Components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── analyzer-app.tsx # Main App State Manager
│   │   ├── dashboard.tsx    # Results Dashboard
│   │   ├── theme-provider.tsx
│   │   └── upload-section.tsx # Drag & Drop Upload
│   └── lib/                 # Core Logic
│       ├── analyzer/        # Scoring & AI Engine
│       │   ├── ai.ts        # Gemini LLM Integration
│       │   ├── nlp.ts       # TF-IDF & Keyword Extraction
│       │   ├── parser.ts    # PDF/DOCX Parsing
│       │   └── scoring.ts   # Deterministic ATS Scoring
│       └── constants.ts     # Companies & Roles DB
├── package.json
├── tailwind.config.ts
└── README.md
```

## Installation & Setup

1. **Clone or Extract the Project**
   Navigate to the project root directory.

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root of the project and add your API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Note: If you plan to extend this to OpenAI or Groq, you can add `OPENAI_API_KEY` or `GROQ_API_KEY` and update `src/lib/analyzer/ai.ts` accordingly.*

4. **Run Locally**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

For this MVP, a standard React Testing Library and Jest configuration can be added. 
To add it later, run:
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom ts-jest
```

For now, the easiest way to test is to run `npm run lint` and `npm run build` to ensure type safety and build integrity.

## Deployment

The application is completely ready to be deployed on **Vercel**:
1. Push the repository to GitHub.
2. Go to Vercel and import the repository.
3. In the Vercel project settings, add the `GEMINI_API_KEY` environment variable.
4. Click **Deploy**.

*(Netlify is also supported via standard Next.js deployment steps).*

## Future Scope

- **OCR Integration**: For scanned PDF resumes using Tesseract.js.
- **Multi-language Support**: Expanding NLP processing to support Spanish, French, etc.
- **Authentication**: Using NextAuth for saving resume history.
- **Recruiter Dashboard**: Allowing recruiters to upload job descriptions (JDs) and rank candidates.

## License
MIT License
