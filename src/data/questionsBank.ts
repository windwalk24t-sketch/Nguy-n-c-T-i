import { Question } from '../types';

export const INITIAL_QUESTIONS_BANK: Question[] = [
  {
    id: 'q-101',
    title: 'Câu hỏi lệnh in cơ bản',
    description: 'Đoạn mã Python nào dưới đây dùng để in chuỗi chữ "Chào Python" ra màn hình đúng cách?',
    type: 'multiple_choice',
    grade: '6',
    topic: 'Lệnh print()',
    difficulty: 'Dễ',
    points: 10,
    options: [
      'print("Chào Python")',
      'Console.WriteLine("Chào Python")',
      'echo "Chào Python"',
      'printf("Chào Python")'
    ],
    correctAnswer: 0,
    explanation: 'Trong Python, chúng ta sử dụng hàm print("chuỗi") để in văn bản ra màn hình console.',
    hint: 'Tìm hàm bắt đầu bằng chữ "print" có dấu ngoặc tròn () nhé!'
  },
  {
    id: 'q-102',
    title: 'Tính số dư trong Python',
    description: 'Kết quả của phép toán Python `17 % 5` bằng bao nhiêu?',
    type: 'multiple_choice',
    grade: '6',
    topic: 'Toán tử Python',
    difficulty: 'Dễ',
    points: 10,
    options: ['3', '2', '3.4', '1'],
    correctAnswer: 1,
    explanation: 'Toán tử % trong Python dùng để lấy phần dư của phép chia. 17 chia 5 được 3 dư 2.',
    hint: '17 = 5 * 3 + bao nhiêu?'
  },
  {
    id: 'q-103',
    title: 'Biến và Nhập dữ liệu',
    description: 'Lệnh `input("Nhập tên: ")` trả về dữ liệu thuộc kiểu dữ liệu nào?',
    type: 'multiple_choice',
    grade: '7',
    topic: 'Biến & input()',
    difficulty: 'Dễ',
    points: 15,
    options: [
      'Kiểu số nguyên (int)',
      'Kiểu số thực (float)',
      'Kiểu chuỗi văn bản (str)',
      'Kiểu Đúng/Sai (bool)'
    ],
    correctAnswer: 2,
    explanation: 'Hàm input() luôn trả về kiểu dữ liệu chuỗi (str). Muốn tính toán số học, ta phải dùng int() hoặc float() để ép kiểu.',
    hint: 'Dù người dùng nhập số 10 thì input() vẫn hiểu là chữ "10".'
  },
  {
    id: 'q-104',
    title: 'Tìm lỗi sai Thụt lùi dòng (Indentation)',
    description: 'Sửa đoạn mã bị lỗi IndentationError dưới đây để kiểm tra tuổi học sinh THCS:',
    type: 'debugging',
    grade: '7',
    topic: 'Câu lệnh if/else',
    difficulty: 'Trung Bình',
    points: 20,
    starterCode: `# Đoạn code bị lỗi thụt dòng
tuoi = 13
if tuoi >= 11:
print("Em là học sinh THCS")
else:
print("Em là học sinh Tiểu học")`,
    explanation: 'Trong Python, khối lệnh bên trong if và else BẮT BUỘC phải được thụt lùi (thường là 4 khoảng trắng hoặc phím Tab).',
    hint: 'Hãy thêm 4 khoảng trắng (hoặc phím Tab) trước 2 dòng print nhé!',
    testCases: [
      {
        expectedOutput: 'Em là học sinh THCS',
        description: 'Chạy đúng với tuổi = 13'
      }
    ]
  },
  {
    id: 'q-105',
    title: 'Vòng lặp tính tổng số từ 1 đến N',
    description: 'Viết chương trình Python tính tổng các số từ 1 đến 10 sử dụng vòng lặp `for` và in ra kết quả.',
    type: 'code_challenge',
    grade: '8',
    topic: 'Vòng lặp for',
    difficulty: 'Trung Bình',
    points: 25,
    starterCode: `# Viết code tính tổng từ 1 đến 10
tong = 0
for i in range(1, 11):
    # Cộng dồn i vào tong
    pass

print("Tổng là:", tong)`,
    explanation: 'Trong vòng lặp, ta viết `tong += i` hoặc `tong = tong + i`. Hàm `range(1, 11)` sẽ duyệt i từ 1 tới 10.',
    hint: 'Thay dòng `pass` bằng `tong += i`.',
    testCases: [
      {
        expectedOutput: 'Tổng là: 55',
        description: 'Kiểm tra tổng từ 1 đến 10'
      }
    ]
  },
  {
    id: 'q-106',
    title: 'Thao tác với Danh sách (List)',
    description: 'Nếu `ds = [10, 20, 30, 40]`, giá trị của `ds[1]` là bao nhiêu?',
    type: 'multiple_choice',
    grade: '8',
    topic: 'Danh sách (List)',
    difficulty: 'Dễ',
    points: 15,
    options: ['10', '20', '30', '40'],
    correctAnswer: 1,
    explanation: 'Chỉ số (index) của List trong Python bắt đầu từ 0. ds[0] là 10, ds[1] là 20.',
    hint: 'Nhớ là đếm vị trí từ 0 nhé! Vị trí 0 -> 10, Vị trí 1 -> ?'
  },
  {
    id: 'q-107',
    title: 'Thử thách: Viết hàm kiểm tra Số Nguyên Tố',
    description: 'Viết hàm `kiem_tra_nguyen_to(n)` nhận vào số nguyên n. Trả về True nếu n là số nguyên tố, ngược lại False.',
    type: 'code_challenge',
    grade: '9',
    topic: 'Hàm & Thuật toán',
    difficulty: 'Thử Thách',
    points: 35,
    starterCode: `def kiem_tra_nguyen_to(n):
    if n < 2:
        return False
    for i in range(2, n):
        if n % i == 0:
            return False
    return True

# Chạy thử
print("7 là số nguyên tố:", kiem_tra_nguyen_to(7))
print("9 là số nguyên tố:", kiem_tra_nguyen_to(9))`,
    explanation: 'Số nguyên tố là số nguyên lớn hơn 1 và chỉ chia hết cho 1 và chính nó. Ta dùng vòng lặp thử chia từ 2 tới n-1.',
    hint: 'Hãy chạy thử mã nguồn mẫu đã có sẵn để xem kết quả nhé!',
    testCases: [
      {
        expectedOutput: '7 là số nguyên tố: True\n9 là số nguyên tố: False',
        description: 'Kiểm tra với số 7 và số 9'
      }
    ]
  }
];
