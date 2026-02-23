import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

// Initialize the Gemini API only if the key is available
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function validateName(name: string): Promise<{ isValid: boolean; reason?: string }> {
  if (!genAI) {
    // If no API key, bypass validation and assume valid. 
    console.warn("GEMINI_API_KEY is not set. Skipping name validation.");
    return { isValid: true };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Using a fast model

    const prompt = `
You are a content moderation AI. Your job is to validate user-submitted names for an interactive digital billboard campaign.
The name should be a valid, reasonable display name (e.g., John, The Group, Cool Company).
It must NOT contain:
1. Profanity, offensive, or inappropriate words.
2. Spam, URLs, or overly promotional text that isn't a simple name.
3. Nonsense characters (e.g., "asdfghjkl") or excessive symbols.

Evaluate the following name: "${name}"

Reply strictly in JSON format with exactly these two fields:
{
  "isValid": boolean,
  "reason": "If isValid is false, provide a short, polite reason why it is not allowed (e.g. 'Contains inappropriate language' or 'Appears to be spam.'). If true, this can be empty."
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Failed to parse Gemini response as JSON:", responseText);
      return { isValid: true }; // Allow on parsing error
    }

    const json = JSON.parse(jsonMatch[0]);
    return {
      isValid: Boolean(json.isValid),
      reason: json.reason || "Invalid name",
    };
  } catch (error) {
    console.error("Error during name validation with Gemini:", error);
    // On unexpected error, default to allow so we don't block users unnecessarily
    return { isValid: true };
  }
}
