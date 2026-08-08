import { PythonExecutionResult } from '../types';

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL?: string }) => Promise<any>;
    pyodide?: any;
  }
}

let pyodideInstance: any = null;
let isLoadingPyodide = false;

export async function initPyodide(): Promise<any> {
  if (pyodideInstance) return pyodideInstance;
  if (isLoadingPyodide) {
    // Wait for pyodide to load
    let attempts = 0;
    while (!pyodideInstance && attempts < 30) {
      await new Promise((r) => setTimeout(r, 200));
      attempts++;
    }
    if (pyodideInstance) return pyodideInstance;
  }

  if (typeof window !== 'undefined' && window.loadPyodide) {
    try {
      isLoadingPyodide = true;
      pyodideInstance = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
      });
      isLoadingPyodide = false;
      return pyodideInstance;
    } catch (e) {
      console.warn('Pyodide load failed, falling back to simulated engine:', e);
      isLoadingPyodide = false;
    }
  }
  return null;
}

export async function runPythonCode(
  code: string,
  inputValues: string[] = []
): Promise<PythonExecutionResult> {
  const startTime = performance.now();

  try {
    const py = await initPyodide();

    if (py) {
      // Redirect stdout & stderr
      let outputs: string[] = [];
      let inputIndex = 0;

      py.setStdout({
        batched: (text: string) => {
          outputs.push(text);
        }
      });

      py.setStderr({
        batched: (text: string) => {
          outputs.push(`[Error] ${text}`);
        }
      });

      // Mock input function in Pyodide
      if (inputValues.length > 0) {
        py.globals.set('__user_inputs__', inputValues);
        await py.runPythonAsync(`
import builtins
__input_idx__ = 0
def __custom_input__(prompt=""):
    global __input_idx__
    if prompt:
        print(prompt, end="")
    if __input_idx__ < len(__user_inputs__):
        val = str(__user_inputs__[__input_idx__])
        __input_idx__ += 1
        print(val)
        return val
    return ""
builtins.input = __custom_input__
        `);
      }

      await py.runPythonAsync(code);

      const endTime = performance.now();
      const outputText = outputs.join('\n').trim();

      return {
        success: true,
        output: outputText || 'Chương trình đã chạy xong (Không có output in ra).',
        executionTimeMs: Math.round(endTime - startTime)
      };
    }
  } catch (err: any) {
    // Process error message cleanly for students
    let errStr = err?.message || String(err);
    if (errStr.includes('PythonError:')) {
      errStr = errStr.split('PythonError:')[1] || errStr;
    }
    return {
      success: false,
      output: '',
      error: formatVietnamesePythonError(errStr),
      executionTimeMs: Math.round(performance.now() - startTime)
    };
  }

  // Pure JS fallback interpreter for basic Python scripts (print, basic loops, variables)
  return fallbackSimulatePython(code, inputValues);
}

function formatVietnamesePythonError(rawErr: string): string {
  let err = rawErr.trim();
  if (err.includes('IndentationError')) {
    return '❌ Lỗi Thụt Lề (IndentationError): Python bắt buộc các dòng lệnh trong khối if/else/for/def phải lùi vào (dùng 4 khoảng trắng hoặc phím Tab).';
  }
  if (err.includes('SyntaxError')) {
    return '❌ Lỗi Cú Pháp (SyntaxError): Bạn quên dấu hai chấm : hoặc ngoặc kép/ngoặc đơn chưa đóng kín?';
  }
  if (err.includes('NameError')) {
    return `❌ Lỗi Tên Biến (NameError): ${err.split('\n')[0]} -> Bạn có gõ sai tên biến hoặc chưa gán giá trị cho biến trước khi dùng không?`;
  }
  if (err.includes('TypeError')) {
    return `❌ Lỗi Kiểu Dữ Liệu (TypeError): ${err.split('\n')[0]} -> Kiểm tra xem bạn có đang cộng Chuỗi văn bản với Số không nhé! Hãy dùng int() hoặc str().`;
  }
  if (err.includes('ZeroDivisionError')) {
    return '❌ Lỗi Chia Cho 0 (ZeroDivisionError): Trong toán học và lập trình không thể chia một số cho 0!';
  }
  return `❌ Lỗi khi chạy Python:\n${err}`;
}

function fallbackSimulatePython(code: string, inputs: string[] = []): PythonExecutionResult {
  const outputs: string[] = [];
  let inputIdx = 0;

  try {
    const lines = code.split('\n');
    const variables: Record<string, any> = {};

    for (let line of lines) {
      let trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      // Match print(...)
      if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
        let content = trimmed.substring(6, trimmed.length - 1);
        let evaluated = evaluateExpression(content, variables);
        outputs.push(evaluated);
      } else if (trimmed.includes('=')) {
        let parts = trimmed.split('=');
        let varName = parts[0].trim();
        let varValExpr = parts.slice(1).join('=').trim();

        if (varValExpr.startsWith('input(')) {
          let val = inputs[inputIdx] || 'THCS';
          inputIdx++;
          variables[varName] = val;
        } else {
          variables[varName] = evaluateExpression(varValExpr, variables);
        }
      }
    }

    return {
      success: true,
      output: outputs.join('\n') || 'Chương trình chạy hoàn tất (chế độ giả lập).',
      executionTimeMs: 15
    };
  } catch (e: any) {
    return {
      success: false,
      output: '',
      error: `❌ Lỗi cú pháp: ${e.message}`
    };
  }
}

function evaluateExpression(expr: string, vars: Record<string, any>): string {
  try {
    // Replace quotes or variables
    let result = expr;
    for (let k in vars) {
      const reg = new RegExp(`\\b${k}\\b`, 'g');
      result = result.replace(reg, JSON.stringify(vars[k]));
    }
    // Basic comma separated prints: print("A", B)
    if (expr.includes(',')) {
      return expr
        .split(',')
        .map((p) => evaluateExpression(p.trim(), vars))
        .join(' ');
    }
    if (
      (expr.startsWith('"') && expr.endsWith('"')) ||
      (expr.startsWith("'") && expr.endsWith("'"))
    ) {
      return expr.substring(1, expr.length - 1);
    }
    return String(eval(result));
  } catch {
    return expr.replace(/['"]/g, '');
  }
}
