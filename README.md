
# 🍞 ToastNotification.js
# Version 2.0.0
A modern, customizable, and lightweight JavaScript Toast Notification System built with pure HTML5, CSS3, and vanilla JavaScript.

سیستم اعلان (Toast Notification) مدرن، قابل تنظیم و سبک با استفاده از HTML5 و CSS3 و جاوااسکریپت خالص.

---

## ✨ Features | ویژگی‌ها

- ✅ Multiple toast types: `success`, `error`, `warning`, `info`
- 🌍 Position support: top-left, top-right, bottom-center, etc.
- 🎨 Custom icons, animations, and styles
- 🕓 Auto-dismiss with optional duration
- ❌ Dismiss manually with close button
- 🔁 Queue system for stacking notifications
- 🖱️ Clickable toasts with custom callbacks
- 📜 RTL support for Persian/Arabic languages
- ⚙️ Custom class injection
- 🧪 Fully responsive and mobile-friendly
- 🎬 Built-in animation options (slide, fade, bounce, etc.)

---

## 📦 Installation | نصب
You can use Nuget:
```html
dotnet add package ToastNotificationJs --version 2.0.1
```

or

You can simply include the files in your HTML project:

```html
<link rel="stylesheet" href="ToastNotification.css">
<script src="ToastNotification.js"></script>
```

یا فایل‌ها را مستقیماً به پروژه HTML خود اضافه کنید:

```html
<link rel="stylesheet" href="ToastNotification.css">
<script src="ToastNotification.js"></script>
```

---

## 🚀 Usage | نحوه استفاده

```javascript
showToast("Data saved successfully!", "success", "Success", 3000, "top-right", "✅", true, true, "slide", false, "my-toast", () => {
    console.log("Toast clicked!");
});
```

### 🔧 Parameters | پارامترها

| Parameter       | Type      | Description (EN)                              | توضیحات (FA)                           |
|----------------|-----------|-----------------------------------------------|----------------------------------------|
| `message`       | `string`  | The main toast message                       | پیام اصلی نوتیفیکیشن                  |
| `color`         | `string`  | Type: info, success, warning, error          | نوع نوتیفیکیشن                         |
| `title`         | `string`  | Optional title above the message             | عنوان اختیاری                         |
| `duration`      | `number`  | Time to auto-dismiss (ms)                    | مدت زمان نمایش                        |
| `position`      | `string`  | Position on screen                           | موقعیت نمایش روی صفحه                 |
| `icon`          | `string`  | Optional emoji/icon                          | آیکون دلخواه                          |
| `dismissible`   | `boolean` | Whether user can manually close it           | امکان بستن دستی توسط کاربر            |
| `pauseOnHover`  | `boolean` | Pause the timer when hovering                | توقف تایمر هنگام قرار گرفتن ماوس       |
| `animation`     | `string`  | Type of entrance/exit animation              | نوع انیمیشن نمایش                     |
| `rtl`           | `boolean` | Enable right-to-left support                 | پشتیبانی از زبان فارسی یا عربی        |
| `customClass`   | `string`  | Add a custom CSS class                       | اضافه کردن کلاس سفارشی                 |
| `onClick`       | `func`    | Callback when toast is clicked               | اجرای تابع هنگام کلیک روی نوتیفیکیشن  |
| `id`            | `string`  | Optional toast ID                            | شناسه دلخواه برای هر نوتیفیکیشن       |

---

## 📂 Demo | دموی زنده

Just open `index.html` in your browser and try different buttons!
https://webecco.com/ToastNotificationjs/index.html

فایل `index.html` را در مرورگر باز کنید و دکمه‌ها را برای دیدن نمونه‌های مختلف امتحان کنید.

---

## 📸 Screenshots | تصاویر

![Demo](![image](https://github.com/user-attachments/assets/d44d51c4-3717-44fc-9c4d-2ddd0c2f26f9)
)
![Demo](![image](https://github.com/user-attachments/assets/f3916812-d01a-438b-b5a0-3835c03cf3f1)
)

---

## 📜 License | مجوز

MIT License - Free to use, modify, and distribute.

لایسنس MIT - رایگان برای استفاده، تغییر و انتشار.

---

## ✍️ Author | نویسنده

Developed by kaveh norouzi 
Created with ❤️ to make notifications beautiful.

توسعه داده شده توسط کاوه نوروزی
با ❤️ برای زیباتر کردن اعلان‌ها ساخته شده است.
