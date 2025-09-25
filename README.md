# Pomodoro Timer App

Ứng dụng Pomodoro Timer được xây dựng với React + Vite + Capacitor, hỗ trợ thông báo nền, rung và lưu trữ lịch sử phiên làm việc.

## ✨ Tính năng

### Tính năng cốt lõi
- ⏰ **Timer Pomodoro**: 25 phút làm việc + 5 phút nghỉ
- 🔔 **Thông báo nền**: Gửi thông báo khi phiên kết thúc
- 📳 **Rung thiết bị**: Rung điện thoại khi có thông báo
- 💬 **Dialog thông báo**: Hiển thị popup khi phiên hoàn thành
- ⏸️ **Điều khiển timer**: Start/Pause/Reset
- 📊 **Hiển thị trạng thái**: Work/Break/Long Break

### Tính năng mở rộng
- 📈 **Lịch sử phiên**: Lưu trữ và hiển thị các phiên đã hoàn thành
- ⚙️ **Cài đặt tùy chỉnh**: Thay đổi thời gian work/break
- 🔊 **Âm thanh thông báo**: Tùy chọn âm thanh khác nhau
- 🌙 **Dark/Light mode**: Hỗ trợ chế độ tối/sáng
- 📱 **Responsive design**: Tối ưu cho mobile

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 18 + Vite
- **Mobile**: Capacitor
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Plugins**: 
  - @capacitor/local-notifications
  - @capacitor/haptics
  - @capacitor/dialog
  - @capacitor/preferences

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js 16+
- npm hoặc yarn

### Cài đặt dependencies
\`\`\`bash
npm install
\`\`\`

### Cài đặt Capacitor
\`\`\`bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/local-notifications @capacitor/haptics @capacitor/dialog @capacitor/preferences
\`\`\`

## 🚀 Chạy ứng dụng

### Development (Web)
\`\`\`bash
npm run dev
\`\`\`

### Build cho production
\`\`\`bash
npm run build
\`\`\`

### Chạy trên mobile

#### iOS
\`\`\`bash
npx cap add ios
npx cap sync ios
npx cap open ios
\`\`\`

#### Android
\`\`\`bash
npx cap add android
npx cap sync android
npx cap open android
\`\`\`

## 📁 Cấu trúc project

\`\`\`
src/
├── components/
│   ├── PomodoroTimer.jsx      # Component timer chính
│   ├── SessionHistory.jsx     # Lịch sử phiên làm việc
│   └── Settings.jsx           # Cài đặt ứng dụng
├── services/
│   ├── timer.js              # Logic tính toán thời gian
│   ├── notifications.js      # Xử lý thông báo và rung
│   └── storage.js           # Lưu trữ dữ liệu local
├── App.jsx                  # Component gốc
├── main.jsx                # Entry point
└── index.css               # Styles chính
\`\`\`

## 🎯 Cách sử dụng

1. **Bắt đầu phiên làm việc**: Nhấn nút "Start" để bắt đầu timer 25 phút
2. **Tạm dừng/Tiếp tục**: Nhấn "Pause" để tạm dừng, "Resume" để tiếp tục
3. **Reset timer**: Nhấn "Reset" để đặt lại timer về trạng thái ban đầu
4. **Xem lịch sử**: Chuyển sang tab "History" để xem các phiên đã hoàn thành
5. **Cài đặt**: Vào tab "Settings" để tùy chỉnh thời gian và âm thanh

## ⚙️ Cấu hình

### Thời gian mặc định
- **Work session**: 25 phút
- **Short break**: 5 phút  
- **Long break**: 15 phút (sau 4 phiên work)

### Thông báo
- Ứng dụng sẽ yêu cầu quyền thông báo khi khởi động lần đầu
- Thông báo hoạt động ngay cả khi ứng dụng chạy nền

## 🔧 Development

### Scripts có sẵn
- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run preview` - Preview build
- `npm run lint` - Chạy ESLint

### Debugging
- Sử dụng Chrome DevTools cho web
- Sử dụng Safari Web Inspector cho iOS
- Sử dụng Chrome DevTools cho Android

## 📱 Build Mobile App

### iOS
1. Cài đặt Xcode
2. Chạy `npx cap add ios`
3. Chạy `npx cap sync ios`
4. Mở project trong Xcode: `npx cap open ios`
5. Build và test trên simulator/device

### Android
1. Cài đặt Android Studio
2. Chạy `npx cap add android`
3. Chạy `npx cap sync android`
4. Mở project trong Android Studio: `npx cap open android`
5. Build và test trên emulator/device

## 🐛 Troubleshooting

### Thông báo không hoạt động
- Kiểm tra quyền thông báo trong cài đặt thiết bị
- Đảm bảo ứng dụng không bị tắt background refresh

### Timer không chính xác
- Kiểm tra thiết bị không ở chế độ tiết kiệm pin
- Đảm bảo ứng dụng có quyền chạy nền

### Build mobile thất bại
- Kiểm tra version Node.js và dependencies
- Chạy `npx cap sync` sau khi thay đổi code
- Xóa và cài đặt lại node_modules nếu cần

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

## 🤝 Đóng góp

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📞 Liên hệ

Nếu có vấn đề hoặc góp ý, vui lòng tạo issue trên GitHub repository.
