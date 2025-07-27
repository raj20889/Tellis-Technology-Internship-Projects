// index.js
import { config } from "dotenv";
import OpenAI from "openai";
config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function analyzeProduct(product) {
  const userMessage = `Analyze this product:\n${JSON.stringify(product, null, 2)}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a product insights assistant." },
      { role: "user", content: userMessage }
    ]
  });

  console.log("🤖 AI Insight:\n", completion.choices[0].message.content);
}

const product = {
  title: "iPhone 14",
  price: "₹79,999",
  rating: "4.5",
};

analyzeProduct(product);
