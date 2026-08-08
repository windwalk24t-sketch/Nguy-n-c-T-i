import { Lesson } from '../types';

export const THCS_CURRICULUM: Lesson[] = [
  {
    id: 'py-01',
    grade: '6',
    chapter: 'Chương 1: Làm quen với Python',
    title: 'Bài 1: Lệnh print() và Lời chào đầu tiên',
    description: 'Học cách viết chương trình Python đầu tiên hiển thị thông điệp ra màn hình với hàm print().',
    iconName: 'Terminal',
    durationMinutes: 15,
    steps: [
      {
        id: 'py-01-1',
        title: 'Python là gì?',
        content: `Chào mừng bạn đến với thế giới lập trình Python! Python là một ngôn ngữ lập trình rất phổ biến, dễ học và được dùng ở nhiều nơi như làm game, trí tuệ nhân tạo (AI), robot và phân tích dữ liệu.

Để xuất dữ liệu ra màn hình, Python dùng lệnh:
\`\`\`python
print("Nội dung cần in")
\`\`\`
Nội dung nằm trong cặp dấu ngoặc kép **" "** sẽ được in nguyên văn ra màn hình console!`,
        codeExample: `print("Xin chào học sinh THCS!")
print("Mình đang học lập trình Python nè!")
print("1 + 1 =", 1 + 1)`,
        exercise: {
          task: 'Hãy viết chương trình in ra lời chào đến trường THCS của bạn!',
          starterCode: '# Hãy viết lệnh print() dưới đây:\nprint("Tên trường THCS của em là...")',
          solution: 'print("Tên trường THCS của em là Nguyen Du")',
          expectedOutput: 'Tên trường THCS'
        }
      },
      {
        id: 'py-01-2',
        title: 'Tính toán nhanh với Python',
        content: `Python giống như một chiếc máy tính siêu thông minh. Bạn có thể thực hiện các phép toán cơ bản:
- Cộng: \`+\`
- Trừ: \`-\`
- Nhân: \`*\`
- Chia: \`/\`
- Chia lấy phần nguyên: \`//\`
- Lấy số dư: \`%\``,
        codeExample: `print("Cộng:", 15 + 25)
print("Nhân:", 8 * 9)
print("Số dư của 10 chia 3 là:", 10 % 3)`,
        exercise: {
          task: 'Tính tổng số tuổi của 3 bạn trong tổ: 12, 13 và 12 tuổi.',
          starterCode: '# Tính tổng tuổi 3 bạn\ntong_tuoi = 12 + 13 + 12\nprint("Tổng tuổi là:", tong_tuoi)',
          solution: 'print("Tổng tuổi là:", 12 + 13 + 12)'
        }
      }
    ]
  },
  {
    id: 'py-02',
    grade: '7',
    chapter: 'Chương 2: Biến và Nhập dữ liệu',
    title: 'Bài 2: Biến (Variable) & Lệnh input()',
    description: 'Học cách lưu trữ thông tin vào biến và tương tác nhập dữ liệu từ người dùng.',
    iconName: 'Box',
    durationMinutes: 20,
    steps: [
      {
        id: 'py-02-1',
        title: 'Biến trong Python giống như chiếc hộp',
        content: `Biến (variable) dùng để lưu giữ giá trị như tên, tuổi, điểm số để sử dụng lại sau này.

Ví dụ tạo biến:
\`\`\`python
ten = "Minh"
tuoi = 13
diem_toan = 9.5
\`\`\`

Tên biến nên ngắn gọn, không chứa dấu tiếng Việt và không bắt đầu bằng chữ số.`,
        codeExample: `ten_hoc_sinh = "Lê Hoàng"
lop = "7A1"
print("Học sinh:", ten_hoc_sinh)
print("Lớp:", lop)`,
        exercise: {
          task: 'Tạo 2 biến ten_game và diem_so, sau đó in thông báo điểm chơi game.',
          starterCode: 'ten_game = "Minecraft"\ndiem_so = 100\nprint("Game:", ten_game, "- Điểm:", diem_so)',
          solution: 'ten_game = "Minecraft"\ndiem_so = 100\nprint("Game:", ten_game, "- Điểm:", diem_so)'
        }
      },
      {
        id: 'py-02-2',
        title: 'Nhập dữ liệu với input()',
        content: `Muốn Python hỏi người dùng nhập thông tin, ta dùng hàm \`input()\`.
Lưu ý: \`input()\` luôn trả về kiểu **Chuỗi (str)**. Muốn tính toán phải đổi sang số nguyên \`int()\` hoặc số thực \`float()\`.`,
        codeExample: `ten = input("Bạn tên là gì? ")
print("Chào mừng", ten, "đã đến với lớp học Python!")

tuoi_str = input("Nhập tuổi của bạn: ")
tuoi = int(tuoi_str)
print("Năm sau bạn sẽ", tuoi + 1, "tuổi!")`,
        exercise: {
          task: 'Viết chương trình hỏi người dùng nhập năm sinh và tính tuổi hiện tại (giả định năm 2026).',
          starterCode: 'nam_sinh = int(input("Nhập năm sinh của bạn: "))\ntuoi = 2026 - nam_sinh\nprint("Tuổi của bạn năm 2026 là:", tuoi)',
          solution: 'nam_sinh = int(input("Nhập năm sinh: "))\nprint("Tuổi:", 2026 - nam_sinh)'
        }
      }
    ]
  },
  {
    id: 'py-03',
    grade: '7',
    chapter: 'Chương 3: Cấu trúc Rẽ nhánh',
    title: 'Bài 3: Câu lệnh if ... else (Đưa ra quyết định)',
    description: 'Giúp chương trình biết so sánh và đưa ra quyết định thông minh dựa trên điều kiện.',
    iconName: 'GitFork',
    durationMinutes: 20,
    steps: [
      {
        id: 'py-03-1',
        title: 'Cấu trúc if ... else',
        content: `Khi muốn kiểm tra một điều kiện:
\`\`\`python
if dieu_kien:
    # Lệnh thực hiện nếu đúng (True)
else:
    # Lệnh thực hiện nếu sai (False)
\`\`\`
**Lưu ý quan trọng**: Tất cả các lệnh bên trong khối \`if\` hoặc \`else\` phải được **Thụt lùi vào (Indent - 4 khoảng trắng hoặc 1 phím Tab)**.`,
        codeExample: `diem = 8.5
if diem >= 8.0:
    print("Xếp loại: Học sinh Giỏi! Tuyệt vời!")
else:
    print("Hãy cố gắng hơn ở bài kiểm tra sau nhé!")`,
        exercise: {
          task: 'Kiểm tra điểm số nhập vào, nếu >= 5 in "Đạt", ngược lại in "Chưa đạt".',
          starterCode: 'diem = 6.0\nif diem >= 5.0:\n    print("Đạt")\nelse:\n    print("Chưa đạt")',
          solution: 'diem = 6.0\nif diem >= 5.0:\n    print("Đạt")\nelse:\n    print("Chưa đạt")'
        }
      }
    ]
  },
  {
    id: 'py-04',
    grade: '8',
    chapter: 'Chương 4: Vòng lặp trong Python',
    title: 'Bài 4: Vòng lặp for và range()',
    description: 'Tự động thực hiện công việc lặp đi lặp lại nhiều lần mà không cần viết lại code.',
    iconName: 'Repeat',
    durationMinutes: 25,
    steps: [
      {
        id: 'py-04-1',
        title: 'Vòng lặp for với range()',
        content: `Muốn lặp lại một khối lệnh N lần, dùng:
\`\`\`python
for i in range(5):
    print("Lần thứ", i)
\`\`\`
Chức năng \`range(5)\` tạo danh sách số từ \`0\` đến \`4\` (tổng cộng 5 lần).`,
        codeExample: `print("Đếm ngược chuẩn bị phóng tên lửa:")
for i in range(5, 0, -1):
    print(i, "...")
print("🚀 BẮT ĐẦU PHÓNG!")`,
        exercise: {
          task: 'Viết vòng lặp in ra bảng cửu chương 5 từ 1 đến 10.',
          starterCode: '# Bảng cửu chương 5\nfor i in range(1, 11):\n    print("5 x", i, "=", 5 * i)',
          solution: 'for i in range(1, 11):\n    print("5 x", i, "=", 5 * i)'
        }
      }
    ]
  },
  {
    id: 'py-05',
    grade: '8',
    chapter: 'Chương 5: Danh sách (List)',
    title: 'Bài 5: Quản lý Danh sách (List) dữ liệu',
    description: 'Lưu trữ chuỗi nhiều giá trị trong cùng một biến duy nhất.',
    iconName: 'ListOrdered',
    durationMinutes: 25,
    steps: [
      {
        id: 'py-05-1',
        title: 'Tạo và truy xuất List',
        content: `Danh sách (List) trong Python được tạo bằng cặp ngoặc vuông \`[]\`.
Vị trí phần tử (chỉ số - index) bắt đầu từ **0**.`,
        codeExample: `trai_cay = ["Táo", "Cam", "Xoài", "Dưa hấu"]
print("Món đầu tiên:", trai_cay[0])
print("Số lượng trái cây:", len(trai_cay))

# Thêm món mới
trai_cay.append("Sầu riêng")
print("Danh sách sau khi thêm:", trai_cay)`,
        exercise: {
          task: 'Tạo danh sách gồm 3 môn học yêu thích và dùng vòng lặp for để in từng môn ra.',
          starterCode: 'mon_hoc = ["Toán", "Tin học", "Tiếng Anh"]\nfor mon in mon_hoc:\n    print("Môn yêu thích:", mon)',
          solution: 'mon_hoc = ["Toán", "Tin học", "Tiếng Anh"]\nfor mon in mon_hoc:\n    print("Môn yêu thích:", mon)'
        }
      }
    ]
  },
  {
    id: 'py-06',
    grade: '9',
    chapter: 'Chương 6: Hàm (Function)',
    title: 'Bài 6: Định nghĩa Hàm với từ khóa def',
    description: 'Gói gọn một đoạn mã lệnh xử lý công việc cụ thể để gọi lại nhiều lần dễ dàng.',
    iconName: 'Code2',
    durationMinutes: 30,
    steps: [
      {
        id: 'py-06-1',
        title: 'Cách tạo Hàm trong Python',
        content: `Định nghĩa hàm bằng từ khóa \`def\`:
\`\`\`python
def ten_ham(tham_so):
    # Khối lệnh
    return ket_qua
\`\`\``,
        codeExample: `def tinh_chu_vi_hinh_chu_nhat(dai, rong):
    chu_vi = (dai + rong) * 2
    return chu_vi

cv1 = tinh_chu_vi_hinh_chu_nhat(10, 5)
print("Chu vi hình chữ nhật (10x5) là:", cv1)`,
        exercise: {
          task: 'Viết hàm kiem_tra_chan_le(so) trả về "Chẵn" nếu số chia hết cho 2, ngược lại "Lẻ".',
          starterCode: 'def kiem_tra_chan_le(so):\n    if so % 2 == 0:\n        return "Chẵn"\n    else:\n        return "Lẻ"\n\nprint(kiem_tra_chan_le(7))\nprint(kiem_tra_chan_le(10))',
          solution: 'def kiem_tra_chan_le(so):\n    return "Chẵn" if so % 2 == 0 else "Lẻ"'
        }
      }
    ]
  }
];
