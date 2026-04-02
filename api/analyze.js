const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // لدعم إرسال الصور الكبيرة

// المحرك الرئيسي للتحليل
app.post('/analyze', async (req, res) => {
    // قراءة المفتاح من متغيرات البيئة في Render (أو استخدامه مباشرة إذا لم يوجد)
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCCdRhtvnbdE3ExlOQ8L6Sdtey4UHLekpc";
    
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const { image, prompt } = req.body;

        if (!image || !prompt) {
            return res.status(400).json({ error: "Missing image or prompt" });
        }

        // هيكلية Gemini الصحيحة لاستقبال النص والصورة معاً
        const result = await model.generateContent([
            { text: prompt },
            { inlineData: { data: image, mimeType: "image/jpeg" } }
        ]);

        const response = await result.response;
        const text = response.text();
        
        res.status(200).json({ text: text });
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// لتجنب خطأ 404 عند فتح الرابط في المتصفح
app.get('/', (req, res) => res.send("Skincare AI Proxy is Running!"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
