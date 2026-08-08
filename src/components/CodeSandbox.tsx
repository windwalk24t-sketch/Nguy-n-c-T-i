import React, { useState } from 'react';
import { runPythonCode } from '../lib/pythonRunner';
import { Play, RotateCcw, Sparkles, Code, Terminal, Bot, Copy, Check } from 'lucide-react';

interface CodeSandboxProps {
  initialCode?: string;
  onAskAiAboutCode: (code: string) => void;
}

const TEMPLATES = [
  {
    name: '1. Hello World',
    code: `# Lời chào đầu tiên bằng Python
print("Xin chào học sinh THCS!")
print("Chào mừng bạn đến với Python Sandbox!")
print("10 + 20 =", 10 + 20)
`,
  },
  {
    name: '2. Game Đoán Số',
    code: `# Mini Game Đoán Số
so_bi_mat = 7
doan = 7  # Giả định câu trả lời

print("--- MINI GAME ĐOÁN SỐ ---")
if doan == so_bi_mat:
    print("🎉 Tuyệt vời! Bạn đã đoán đúng số bí mật là", so_bi_mat)
else:
    print("❌ Rất tiếc, bạn đoán chưa đúng. Thử lại nhé!")
`,
  },
  {
    name: '3. Bảng Cửu Chương',
    code: `# In bảng cửu chương 5
print("=== BẢNG CỬU CHƯƠNG 5 ===")
for i in range(1, 11):
    print("5 x", i, "=", 5 * i)
`,
  },
  {
    name: '4. Kiểm Tra Số Nguyên Tố',
    code: `# Kiểm tra một số xem có phải số nguyên tố không
def kiem_tra_nguyen_to(n):
    if n < 2:
        return False
    for i in range(2, n):
        if n % i == 0:
            return False
    return True

so = 13
if kiem_tra_nguyen_to(so):
    print(so, "là SỐ NGUYÊN TỐ!")
else:
    print(so, "không phải số nguyên tố.")
`,
  },
  {
    name: '5. Quản Lý Danh Sách',
    code: `# Quản lý danh sách món ăn yêu thích
mon_an = ["Trà sữa", "Bánh mì", "Gà rán", "Phở"]

print("Số món ăn trong danh sách:", len(mon_an))
print("Món ăn yêu thích nhất:", mon_an[0])

print("\n--- Tất cả các món ---")
for idx, mon in enumerate(mon_an, 1):
    print(f"{idx}. {mon}")
`,
  },
];

export const CodeSandbox: React.FC<CodeSandboxProps> = ({
  initialCode,
  onAskAiAboutCode,
}) => {
  const [code, setCode] = useState<string>(
    initialCode || TEMPLATES[0].code
  );
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Đang thực thi mã Python...');

    const res = await runPythonCode(code);

    setIsRunning(false);
    if (res.success) {
      setOutput(res.output || 'Đã thực thi thành công (Không có output in ra).');
    } else {
      setOutput(res.error || 'Có lỗi xảy ra.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Code className="w-6 h-6 text-indigo-600" />
            <span>Phòng Lập Trình Python (Sandbox)</span>
          </h1>
          <p className="text-slate-600 text-sm font-medium mt-1">
            Thỏa sức viết, chạy thử mã Python thực tế ngay trên trình duyệt mà không cần cài đặt gì!
          </p>
        </div>

        {/* Template selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Mẫu code:</span>
          <select
            onChange={(e) => {
              const t = TEMPLATES.find((x) => x.name === e.target.value);
              if (t) setCode(t.code);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl focus:outline-none focus:border-indigo-500"
          >
            {TEMPLATES.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor & Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Code Editor */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[520px]">
          <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2 font-bold text-slate-200 font-sans">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="ml-2">main.py</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="hover:text-slate-200 flex items-center gap-1 font-sans font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
              </button>

              <button
                onClick={() => setCode(TEMPLATES[0].code)}
                className="hover:text-slate-200 flex items-center gap-1 font-sans font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xóa trắng</span>
              </button>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full p-5 bg-slate-900 text-emerald-400 font-mono text-sm leading-relaxed focus:outline-none resize-none"
            placeholder="# Nhập mã Python tại đây..."
          />

          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isRunning ? 'Đang thực thi...' : 'Chạy Code (Run)'}</span>
            </button>

            <button
              onClick={() => onAskAiAboutCode(code)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>Nhờ AI Agent phân tích / tìm lỗi</span>
            </button>
          </div>
        </div>

        {/* Right: Output Console Window */}
        <div className="lg:col-span-5 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[520px]">
          <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-sans font-bold">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Console Output</span>
            </div>
            <button
              onClick={() => setOutput('')}
              className="hover:text-slate-200 text-[11px]"
            >
              Xóa terminal
            </button>
          </div>

          <div className="flex-1 p-5 overflow-y-auto font-mono text-xs text-slate-100 space-y-2 bg-slate-950/60">
            {output ? (
              <pre className="whitespace-pre-wrap leading-relaxed font-mono">{output}</pre>
            ) : (
              <div className="text-slate-600 text-center pt-20 font-sans space-y-2">
                <Terminal className="w-8 h-8 mx-auto opacity-40" />
                <p>Nhấn nút **Chạy Code (Run)** để thấy kết quả hiển thị tại đây!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
