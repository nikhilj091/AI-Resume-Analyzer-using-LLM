import natural from 'natural';
import nlp from 'compromise';
import * as stopword from 'stopword';

export function preprocessText(text: string): string[] {
  // 1. Lowercase and remove basic special characters
  let cleanText = text.toLowerCase().replace(/[^a-z0-9\s#\+\-\.]/g, ' ');

  // 2. Tokenization using natural
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(cleanText) || [];

  // 3. Remove stopwords
  const noStopWords = stopword.removeStopwords(tokens);

  // 4. Stemming (optional, but good for variations like "developing" vs "developer")
  // We'll keep the original words as well to not lose specific technical terms
  
  return noStopWords.filter(token => token.length > 1);
}

export function calculateCosineSimilarity(textTokens: string[], targetKeywords: string[]): number {
  if (targetKeywords.length === 0 || textTokens.length === 0) return 0;

  const TfIdf = natural.TfIdf;
  const tfidf = new TfIdf();

  // Add the target keywords as a document
  tfidf.addDocument(targetKeywords.join(' '));
  // Add the resume tokens as a document
  tfidf.addDocument(textTokens.join(' '));

  // Natural's TfIdf doesn't directly give cosine similarity of two documents easily.
  // We'll calculate a simple TF-IDF based keyword match score.
  
  let score = 0;
  let maxPossibleScore = 0;

  // For each keyword in target, check its tf-idf in the resume document (doc index 1)
  targetKeywords.forEach(keyword => {
    maxPossibleScore += 1; // Assuming ideal tf-idf weight
    tfidf.tfidfs(keyword, function(i, measure) {
      if (i === 1) { // 1 is the index of the resume document
        if (measure > 0) {
          score += 1; // Simplify: if it exists and has weight, add to score
        }
      }
    });
  });

  return Math.min(100, Math.round((score / maxPossibleScore) * 100));
}

export function extractSkills(text: string, knownSkills: string[]): string[] {
  const doc = nlp(text.toLowerCase());
  const foundSkills = new Set<string>();

  knownSkills.forEach(skill => {
    // Exact match for compound words or specific terms like "Node.js"
    if (text.toLowerCase().includes(skill.toLowerCase())) {
      foundSkills.add(skill);
    }
  });

  return Array.from(foundSkills);
}
