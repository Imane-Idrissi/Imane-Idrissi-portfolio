# CollabApp

A team collaboration tool where messy discussions become organized tasks. Talk first, organize later.

---

## What is CollabApp

When teams discuss a project, there's a mental overhead that starts before anyone writes a single task. People are already thinking about structure: "is this an action item?", "should I phrase this as a task?", "who should own this?" That thinking happens *during* the conversation, and it gets in the way. People self-edit, hold back half-formed ideas, and limit what they explore because everything feels like a commitment.

**CollabApp removes that overhead.** You talk freely, even messily, without caring about structure. When the conversation runs its course, the AI reads what was said and reveals the tasks that are buried in it. You review, adjust, and confirm. The structure appears after the thinking, not during it.

![CollabApp](/assets/projects/collab-app/hero.png)

---

## How It Works

The core loop has three phases:

**Phase 1: Be messy.** The chat doesn't try to organize anything. No reaction added on purpose. No structure imposed on the conversation.

**Phase 2: AI reveals tasks.** One button reads the conversation and surfaces the tasks buried in it. Each suggestion is editable before it reaches the board. The AI only processes messages since the last extraction, so running it multiple times during a long discussion doesn't produce duplicates.

**Phase 3: Confirm and organize.** The suggestions appear in a review modal. The team deselects what doesn't belong, edits what the AI got wrong, and adds the rest to the board. From here it's a kanban: drag between columns, set priorities, create additional tasks manually.

---

## Some Key Decisions

### What the AI sees and what it doesn't

The extraction sends each message as `sender: text`. Just the name of who said it and what they said. No timestamps, no file attachments, no message IDs.

Timestamps would add noise. The AI doesn't need to know that a message was sent at 10:47am to extract "we need to refactor the auth module" as a task. Keeping the context minimal also reduces token usage, which matters when users pay for their own API calls.

The AI extracts a title, description, and priority for each task. It doesn't try to extract assignees. That was a deliberate choice: in a messy conversation, people say things like "someone should handle this" or "we need to look into that." Inferring who should own the task from that kind of language would produce mostly wrong suggestions. Priority is different. It's easier to pick up from tone ("this is blocking us" vs "at some point we could").

### Extraction needs a checkpoint, not just a timestamp

When you extract tasks, the app inserts a visible divider message in the chat. The next extraction only reads messages after that divider.

The alternative is storing a timestamp of the last extraction and querying messages after it. That works technically, but the marker does two things at once: it scopes the AI input (so you don't get duplicate suggestions), and it shows the team exactly where the last extraction happened in the conversation. If someone joins later, they can see what was already processed and what wasn't. One mechanism, two purposes, no extra state to track.

### Preventing lost updates without locking the UI

Multiple people edit the same board. Without anything in place, the last save silently overwrites the first.

CRDTs and OT solve this properly but are overengineered for task cards. Short fields edited one at a time, not documents co-authored in real time. I used two layers instead. Every board edit broadcasts via WebSocket, so you see changes as they happen and rarely touch the same task someone else is editing. When that does happen, every task carries a version number. The server rejects stale edits with a 409, the client reverts the optimistic update and tells the user what changed. No data is lost, no UI freezes.

### Bring your own API key

Each project stores its own Gemini API key. The backend encrypts it at rest, decrypts it only at extraction time, and the UI never shows more than the last four characters.

This is a trust and scaling decision. On trust: teams see their own usage in Google's dashboard, can rotate or revoke the key anytime, and know exactly which API account their conversations are processed through. On scaling: there's no shared quota to manage, no rate limiting across users, and no billing layer to build. Each team is self-contained.

---

## Links

- [Try CollabApp →](https://collabapp-rho.vercel.app/)
- [GitHub Repository](https://github.com/Imane-Idrissi/CollabApp)
