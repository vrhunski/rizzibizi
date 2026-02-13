
# RizziBizzi 🧠🚀

**RizziBizzi** is a high-performance technical interview preparation engine. Unlike traditional "flashcard" apps, RizziBizzi is built on the pillars of **Cognitive Science** and **Educational Psychology** to ensure that information moves from short-term memory into long-term mastery.

## 📖 The Science of Learning

RizziBizzi isn't just an AI quizzer; it’s a cognitive simulator designed to fight the "Illusion of Competence." We integrate several key scientific principles:

- **Active Recall**: Instead of passive re-reading, RizziBizzi forces your brain to retrieve information. This strengthens neural pathways more effectively than any other study method.
- **Desirable Difficulty**: Based on the research of Robert Bjork, the AI generates questions at the "sweet spot" of challenge. If it's too easy, you don't learn; if it's too hard, you give up. We calibrate to your level (Junior, Medium, Senior).
- **Metacognitive Calibration**: After every answer, we ask for your **Confidence Level**. This forces you to evaluate your own knowledge state. Our analytics then highlight "Illusions"—topics where you felt confident but were actually incorrect.
- **Socratic Mentorship**: Our AI Tutor doesn't just give answers. It uses the Socratic method to lead you toward the correct mental model, asking probing questions and connecting new info to existing knowledge.
- **Dual Coding & Contextual Anchoring**: Every question is accompanied by a **Logical Blueprint** (Java code). By seeing the concept and the implementation side-by-side, your brain forms stronger, multi-modal memories.

## ✨ Key Features

- **Logic vs. Conceptual Classification**: Questions are tagged so you know if you're testing your **trace-and-debug** skills (Logic) or your **architectural/theoretical** understanding (Conceptual).
- **Mandatory Logical Blueprints**: Every question includes a perfectly formatted, multi-line Java snippet to ground abstract theory in concrete code.
- **Neural Mastery Guide**: At the end of a session, get a synthesized Markdown summary featuring "Mental Hooks" (mnemonics) and "Senior Perspectives" for high-stakes recall.
- **Socratic Follow-ups**: Engage in a deep-dive conversation with the AI about any specific question to clarify edge cases.
- **Metacognition Matrix**: A post-session breakdown that categorizes your performance into Mastered, Illusions, Lucky, and Gaps.

## 🛠️ Tech Stack

- **Framework**: React 19 (Modern Hooks & Functional Architecture)
- **AI Engine**: **Google Gemini 2.5/3** (Utilizing Flash for speed and Pro for complex reasoning)
- **Syntax Highlighting**: Prism.js with custom Tomorrow Night integration
- **Styling**: Tailwind CSS (Sage & Forest color palette for reduced cognitive load)
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- A modern web browser.
- A **Google Gemini API Key**. You can obtain one from the [Google AI Studio](https://aistudio.google.com/).

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/rizzibizzi.git
   cd rizzibizzi
   ```

2. **Setup Environment**:
   Ensure your environment has access to your `API_KEY`. The app is designed to be served as a static site using modern ES6 modules.

3. **Running Locally**:
   ```bash
   npx serve .
   ```

## 📝 Best Practices for Your Markdown Notes

To help the Cognitive Engine build the best possible quiz:
- **Use Hierarchical Headings**: `## Topic` helps the AI identify core concepts.
- **Provide Context**: Don't just list facts. Explain *why* a design pattern is used or *when* a specific collection type is preferred.
- **Include Snippets**: Even small code examples in your notes act as "seeds" for the AI to grow complex Logic Challenges.

---
*Built with ❤️ for the developer community. Optimized for the human brain.*
