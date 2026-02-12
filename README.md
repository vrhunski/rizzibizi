# RizziBizzi 🚀

**RizziBizzi** is an intelligent, AI-powered technical interview preparation tool designed for developers. It transforms your raw Markdown study notes into interactive, high-quality technical quizzes tailored to your specific experience level.

## 📖 About

Generic interview prep apps often ask repetitive, out-of-context questions. RizziBizzi bridges this gap by using **Google Gemini AI** to analyze your personal study materials—whether they are architecture notes, stack-specific documentation, or textbook summaries—and generating challenging tests that actually matter to your learning journey.

## ✨ Key Features

- **Custom Quiz Generation**: Instantly creates 5, 10, 15, or 20 questions based on your provided Markdown content.
- **Experience Levels**: Tailor the difficulty to **Junior**, **Medium**, or **Senior** developer personas.
- **AI Tutor Integration**: Get stuck on a result? Ask the built-in AI tutor for deeper clarifications on any question.
- **Code Examples**: Questions often include contextual code snippets to test your reading and debugging skills.
- **Mastery Cheatsheet**: Automatically synthesizes your test results into a concise Markdown cheatsheet for final review.
- **Local Persistence**: Automatically saves your Markdown content to `localStorage` so you never lose your progress between sessions.
- **Privacy First**: Your notes stay in your browser; they are only sent to the Gemini API for content generation.

## 🛠️ Tech Stack

- **Framework**: React 19 (Functional Components & Hooks)
- **AI Engine**: [Google Generative AI (Gemini 3 Flash)](https://ai.google.dev/)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Syntax Highlighting**: Prism.js
- **Icons & UI**: Lucide React

## 🚀 Getting Started

### Prerequisites

- A modern web browser.
- A **Google Gemini API Key**. You can obtain one from the [Google AI Studio](https://aistudio.google.com/).
- A local development server (like Vite, Live Server, or `serve`).

### Installation & Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/rizzibizzi.git
   cd rizzibizzi
   ```

2. **Setup Environment Variables**:
   Create a `.env` file in the root directory and add your API key:
   ```env
   API_KEY=your_gemini_api_key_here
   ```

3. **Running Locally**:
   Since this project uses modern ES6 modules and an `importmap`, you can serve it using any static file server.
   
   If you have Node.js installed:
   ```bash
   # Using npx and serve
   npx serve .
   ```
   Or if you prefer a dev-specific tool:
   ```bash
   # Using Vite (Recommended for production builds)
   npm install vite
   npx vite
   ```

4. **Open the App**:
   Navigate to `http://localhost:3000` (or the port provided by your server) to start prepping!

## 📝 Best Practices for Content

For the best results with the AI generator, follow these Markdown tips:
- **Use Clear Headings**: Use `##` or `###` to separate different technical topics.
- **Include Code**: Wrap your code snippets in triple backticks (e.g., \` ```java \`).
- **Be Specific**: Detailed descriptions lead to more nuanced and challenging questions.
- **Use Lists**: Bullet points are excellent for generating "Which of the following..." style questions.

## 🤝 Contributing

Contributions are welcome! If you have ideas for new features or improvements, feel free to open an issue or submit a pull request.

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ for the developer community by RizziBizzi AI.*
