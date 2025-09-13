// Load environment variables from the .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 8000; // You can use any port you prefer

// --- Middleware ---
// Enable CORS for your React frontend
app.use(cors({ origin: 'https://ai-tutor-by-kanwar.vercel.app' }));
// Enable parsing of JSON request bodies
app.use(express.json());

// --- Gemini API Initialization ---
// Make sure you have GEMINI_API_KEY in your .env file
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in the .env file');
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('Welcome to the AI Tutor API!');
});

app.post('/api/ask', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }
    
    console.log(`Received question: ${question}`);

    // Create a prompt for the AI. You can make this more complex later.
    const prompt = `You are a helpful and encouraging tutor. Answer the following student's question clearly and concisely. Question: ${question}`;

    // Ask Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    res.json({ answer });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to get a response from the AI.' });
  }
});

// --- Start the server ---
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});