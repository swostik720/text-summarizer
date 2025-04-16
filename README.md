---

## 📚 Text Summarizer App

A full-stack application for summarizing text and extracting content from PDFs or images using AI. Built with **Laravel (API)** and **React + TailwindCSS (Frontend)**.

---

### 🚀 Features

- ✍️ Summarize user-entered text.
- 📄 Upload PDF or image files to extract and summarize content.
- 📚 View, edit, copy, and delete saved summaries.
- 🧑‍💼 Admin support: Admins can view summaries from all users.
- 🪪 Token-based authentication using Laravel Sanctum.
- ✅ Clean, modern UI with responsive components and smooth interactions.
- ⚙️ Smooth UI/UX with Framer Motion and Lucide icons.

---

### 📦 Tech Stack

- **Frontend:** React, TailwindCSS, Axios, Lucide-react
- **Backend:** Laravel 10+, Sanctum, Smalot PDF Parser, Tesseract OCR
- **AI Integration:** Hugging Face (BART Large CNN Model)

---

### 🛠️ Setup Instructions

#### 1. Clone the repo

```bash
git clone https://github.com/your-username/text-summarizer.git
cd text-summarizer
```

---

### ⚙️ Backend Setup (Laravel API)

#### Requirements:
- PHP 8+
- Composer
- MySQL (or compatible DB)
- Hugging Face API key
- **Tesseract OCR** (must be installed on your local machine)

> **Tesseract Installation (Windows):**  
Download and install from: [https://github.com/tesseract-ocr/tesseract](https://github.com/tesseract-ocr/tesseract)  
Be sure to set the correct path to the executable in the code if needed.

#### Steps:

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
```

> Add your Hugging Face API key to `.env`:

```env
HUGGINGFACE_API_KEY=your_huggingface_key
```

> Start the server:

```bash
php artisan serve
```

---

### 💻 Frontend Setup (React)

#### Requirements:
- Node.js (v16+ recommended)
- npm or yarn

#### Steps:

```bash
cd frontend
npm install
npm run dev
```

> Make sure `axios.js` uses the correct base API URL (e.g., `http://127.0.0.1:8000/api`).

---

### 🔐 Default Admin Credentials

When the database is migrated, a default admin user is created automatically:

```bash
Email: a@a.com  
Password: aaaa
```

---

### 🤝 Contributing

Feel free to improve this project by submitting pull requests, reporting bugs, or suggesting features. All contributions are welcome!

--- 
