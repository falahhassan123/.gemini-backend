const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
    // تأكد من وضع مفتاح Gemini الخاص بك هنا
    const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { image, prompt } = req.body;
        const result = await model.generateContent([
            prompt,
            { inlineData: { data: image, mimeType: "image/jpeg" } }
        ]);
        const response = await result.response;
        res.status(200).json({ text: response.text() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}