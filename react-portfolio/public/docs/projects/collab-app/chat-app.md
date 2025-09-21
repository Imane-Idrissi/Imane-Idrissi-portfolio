# The Chat App

![Chat app overview](/assets/projects/collab-app/chat-view.webp)
*Chat App Interface*

> 🧠 **Innovation Spotlight:** Traditional chat apps store conversations. This one transforms them. Our AI analyzes team discussions and automatically suggests actionable tasks with confidence scoring, bridging the gap between communication and project management.

## Introduction

The challenge I aimed to solve: Most teams communicate in chat but then have to mentally convert discussions into tasks. This extra step creates decision fatigue and slows down productivity.

My solution: Let users chat naturally while an AI assistant analyzes the conversation and suggests structured tasks. Users can then review and select the tasks AI proposes and assign them directly to specific boards.

For this feature, I used Google Gemini to transform natural language into actionable tasks.

---

## AI Task Extraction - From Conversation to Action

When I started building the chat app, I needed a strong reason to reinvent something that already exists. The justification "having all tools in one place" wasn't enough. Teams could already rely on any other external chat app, so adding the complexity of building a whole chat application needed to be justified.

That answer came from the gap between talking and doing. Teams constantly discuss work in chat, but then have to manually convert those discussions into tasks. That extra step creates decision fatigue and slows productivity.

This feature bridges that gap by turning conversations directly into structured tasks.

### How It Works

**Conversation Analysis Engine:** The system captures the last 50 messages, formats them with timestamps and sender names, and sends them to Google's Gemini model. Instead of complex preprocessing, I relied on the model's natural language understanding to identify actionable items.

**Confidence Scoring:** Each suggestion comes with a 0–100% confidence score. Only items above 60% appear, reducing noise.

**Caching for Cost Efficiency:** To keep API usage efficient, I added a 30-minute cache keyed by message content and project context. If the same conversation is analyzed again, results are returned instantly from cache.

**Interface Design:** The challenge was showing all of this without overwhelming users. I solved it with a two-panel modal:

- Left: A grid of task cards showing title, description, confidence, reasoning, and inline editing with checkboxes.
- Right (collapsible): The exact chat messages analyzed, with timestamps and sender names, so users can trace the AI's logic.

Once tasks are selected, a progressive board selector appears: first choose the board, then a column. This staged flow keeps the process lightweight while giving full control.


