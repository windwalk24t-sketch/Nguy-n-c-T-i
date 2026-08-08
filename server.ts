import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI Client (Server-side only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION_TEACHER = `
Bạn là "PyBuddy" - một AI Agent trợ lý dạy học lập trình Python cực kỳ thông minh, thân thiện, vui vẻ và kiên nhẫn dành riêng cho học sinh Trung học Cơ sở (THCS - Lớp 6, Lớp 7, Lớp 8, Lớp 9, độ tuổi 11-15 tuổi) tại Việt Nam.

PHONG CÁCH TƯƠNG TÁC VÀ GIẢNG DẠY:
1. Dùng ngôn ngữ thân thiện, hào hứng, gần gũi với lứa tuổi học sinh THCS (dùng các từ như "Chào bạn nha!", "Tuyệt vời quá!", "Cố lên!", "Để PyBuddy bật mí cho nè!").
2. Sử dụng hình ảnh so sánh thực tế sinh động (ví dụ: biến giống như chiếc hộp quà dán nhãn, vòng lặp giống như đếm số bước nhảy dây, câu lệnh if giống như ngã ba đường đi học, trà sữa, Minecraft, game đoán số).
3. Khi người dùng yêu cầu "Đặt câu hỏi cho tôi" hoặc "Kiểm tra tôi", bạn hãy ĐẶT CÂU HỎI lập trình Python trắc nghiệm hoặc viết code vui nhộn phù hợp với trình độ của lớp được chọn.
4. Khi giải thích lỗi code: Chỉ ra chính xác dòng lỗi, giải thích bằng ví dụ dễ hiểu, và động viên học sinh tự sửa hoặc sửa mẫu chi tiết.
5. Luôn dùng định dạng Markdown đẹp mắt, có ô code python \`\`\`python ... \`\`\` khi trình bày ví dụ.
`;

// API 1: Chat with AI Agent PyBuddy
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, grade = '7', currentCode = '' } = req.body;

    const formattedHistory = (messages || []).map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const lastUserMsg = messages && messages.length > 0 ? messages[messages.length - 1].text : 'Xin chào PyBuddy!';

    let contextPrompt = `[Học sinh đang chọn cấp độ: Lớp ${grade}]`;
    if (currentCode) {
      contextPrompt += `\n[Đoạn code Python học sinh đang viết trong Sandbox]:\n\`\`\`python\n${currentCode}\n\`\`\``;
    }
    contextPrompt += `\n\nNội dung người dùng gửi: ${lastUserMsg}`;

    const chat = ai.chats.create({
      model: 'gemini-3.6-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_TEACHER,
        temperature: 0.7,
      },
    });

    const response = await chat.sendMessage({
      message: contextPrompt,
    });

    res.json({
      success: true,
      reply: response.text || 'PyBuddy đang lắng nghe bạn đây!',
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      success: false,
      error: 'Không thể kết nối với PyBuddy AI. Vui lòng kiểm tra lại GEMINI_API_KEY.',
    });
  }
});

// API 2: Dynamic Question Generator ("Đặt câu hỏi cho tôi")
app.post('/api/generate-question', async (req, res) => {
  try {
    const { grade = '7', topic = 'Tất cả', questionType = 'random' } = req.body;

    const prompt = `Hãy đóng vai AI Agent đặt câu hỏi kiểm tra Python cho học sinh THCS Lớp ${grade}. Chủ đề: "${topic}". 
Tạo 1 câu hỏi tương tác hay, kích thích tư duy học sinh.
Loại câu hỏi có thể là Trắc nghiệm (multiple_choice), Điền từ (fill_in_blank), Tìm lỗi sai (debugging), hoặc Viết code (code_challenge).
Trả về JSON đúng cấu trúc schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_TEACHER,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            type: { type: Type.STRING, description: 'multiple_choice | fill_in_blank | code_challenge | debugging' },
            grade: { type: Type.STRING },
            topic: { type: Type.STRING },
            difficulty: { type: Type.STRING, description: 'Dễ | Trung Bình | Thử Thách' },
            points: { type: Type.INTEGER },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Cho loại câu hỏi trắc nghiệm multiple_choice (đúng 4 lựa chọn)',
            },
            correctAnswer: { type: Type.INTEGER, description: 'Chỉ số lựa chọn đúng (0, 1, 2, 3) cho trắc nghiệm' },
            starterCode: { type: Type.STRING, description: 'Mã khởi tạo cho code_challenge hoặc debugging' },
            hint: { type: Type.STRING },
            explanation: { type: Type.STRING, description: 'Giải thích đáp án chi tiết, dễ hiểu' },
          },
          required: ['id', 'title', 'description', 'type', 'difficulty', 'points', 'hint', 'explanation'],
        },
      },
    });

    let questionData = JSON.parse(response.text || '{}');
    if (!questionData.id) {
      questionData.id = `gen-${Date.now()}`;
    }

    res.json({
      success: true,
      question: questionData,
    });
  } catch (error: any) {
    console.error('Error generating question:', error);
    res.status(500).json({
      success: false,
      error: 'Không thể tạo câu hỏi tự động.',
    });
  }
});

// API 3: Evaluate Code / Solution
app.post('/api/evaluate-answer', async (req, res) => {
  try {
    const { question, userAnswer, output } = req.body;

    const prompt = `Bạn là AI PyBuddy. Hãy chấm điểm và đánh giá bài làm của học sinh THCS cho câu hỏi dưới đây:
Mô tả câu hỏi: ${question.description}
Gợi ý/Đáp án chuẩn: ${question.explanation}

Bài làm / Mã code của học sinh:
\`\`\`python
${userAnswer}
\`\`\`

Kết quả khi chạy thực tế (Console output):
${output || 'Chưa chạy hoặc không xuất ra console'}

Hãy nhận xét xem bài làm đúng hay sai, cho điểm (từ 0 đến 100%), đưa ra lời giải thích chi tiết, nhận xét khích lệ học sinh THCS!
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_TEACHER,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN },
            scorePercent: { type: Type.INTEGER },
            feedback: { type: Type.STRING, description: 'Nhận xét chi tiết khích lệ học sinh' },
            improvementTips: { type: Type.STRING, description: 'Gợi ý cách tối ưu hoặc điểm cần lưu ý' },
          },
          required: ['isCorrect', 'scorePercent', 'feedback'],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    res.json({
      success: true,
      evaluation: result,
    });
  } catch (error: any) {
    console.error('Error evaluating answer:', error);
    res.status(500).json({
      success: false,
      error: 'Không thể chấm bài tự động.',
    });
  }
});

// Start Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
