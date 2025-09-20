# The Task Board - Building for Real Collaboration

![Task board full view](/task-board-images/task-board-full-view.png)
*The complete task board interface - where distributed teams coordinate seamlessly*

> **🕵️ Spoiler:** Notice the "AI generated" badge on the first task? When teams chat naturally in the integrated messaging system, AI analyzes conversations and automatically extracts actionable items as properly formatted tasks. No manual entry needed.

## Introduction

**The realization that shaped everything:** For any collaborative platform, a Kanban board is a must-have feature. But here's the question that kept me thinking—do all Kanban boards need to be the same? Same features, same experience, same limitations?

I started asking myself: **How can I make this feel different while solving real problems that existing task boards ignore?** Most tools either oversimplify (losing essential functionality) or overcomplicate (becoming unusable). I wanted to find that sweet spot where power meets simplicity.

**Two breakthrough features that define this system:**

- **Granular Visibility Options:** The ability to control what each team member sees at the field level. I was thinking about how to balance security with transparency—letting clients see project progress without exposing internal details, budget discussions, or sensitive technical decisions.

- **Collaborative Edit Modal with Conflict Prevention:** Instead of just building an infrastructure that deals with conflicts, I added a UX layer to avoid conflicts entirely. Real-time presence indicators and embedded chat turn potential collisions into conversations.

**The technical challenge:** Building a system that feels instant and responsive while ensuring data never gets corrupted or lost. This tension between speed and correctness drove every architectural decision—from WebSocket room management to optimistic UI updates with intelligent rollback strategies.

> **What you'll see in this walkthrough:** I'll walk you through exactly how I approached each design challenge, the alternatives I considered, and the moments where I chose pragmatism over perfection. This is the story of building a production-ready collaborative system that actually solves real problems.

---

## Functional Requirements - What Users Can Do

Here's what users can accomplish with this task board system:

### Board Management
- Create multiple boards per project with custom workflows
- Invite specific project members to boards (board members vs. project viewers)
- Rename and delete boards with proper access controls
- Switch between boards within the same project seamlessly

### Column Operations
- Add new columns with custom names to match workflow stages
- Rename columns as processes evolve
- Delete empty columns (blocked if column contains tasks)
- Reorder columns by dragging

### Task Management
- Create tasks with title, description, priority, due date, and assignees
- Add attachments (documents, images) to tasks
- Edit any task field with real-time collaboration features
- View task details in read-only modal with full context
- Delete tasks with confirmation and impact preview
- Set granular visibility controls for each task field
- Add and manage subtasks within main tasks

### Interaction & Workflow
- Drag and drop tasks within columns and across columns
- Search tasks by name with live filtering
- Filter tasks by assignee, priority, or due date
- Sort tasks by priority within each column
- View task counts and progress indicators per column

### Real-Time Collaboration
- See live presence indicators when others are viewing/editing tasks
- Chat with other editors directly within task modals
- Receive instant updates when tasks are moved, edited, or created
- View who's currently active on the board
- Get notifications for relevant task changes

---

## Hidden UI Features - The Task Board's Secret Sauce

Here I'll show you the hidden UI we have in the task board. These modal interfaces are where the real magic happens - they're the bridge between simple task cards and complex collaborative workflows.

### Create Task Modal

![Create task modal](/task-board-images/create-task-modal.png)
*Create Task Modal - Notice the visibility checkboxes at the bottom*

**What it does:** This modal allows users to create new tasks with comprehensive details. The key innovation here is the granular visibility controls at the bottom - each field (title, description, assignees, attachments) can be individually configured for visibility to different user types.

**Key features:** Quick task creation with optional detailed configuration, file attachment support, assignee selection from board members, priority and due date setting, and field-level visibility controls for security.

### 🚀 Deep Dive: The Collaborative Edit Modal - Two-Layer Conflict Resolution

![Edit task modal with presence](/task-board-images/edit-modal.png)
*The Edit Modal - Where prevention meets resolution in collaborative editing*

Editing tasks simultaneously is a nightmare in most systems: users get locked out or conflicts corrupt work. I designed a two-layer solution that addresses conflicts at both the human and technical levels.

### Layer 1: Prevention Through UX — "Let's Talk First"

**The Problem:** Technical conflict resolution is reactive. By the time conflicts occur, users are frustrated and work is duplicated.

**The Solution:** A floating chat automatically appears when multiple users edit the same task.

**How It Works:**
* **Presence Detection:** WebSockets broadcast when a user opens a task (`task:start_editing`).
* **Automatic Chat Activation:** If multiple editors are detected, the TaskEditorChat appears.
* **Real-Time Coordination:** Editors can negotiate edits: "I'll update the description, you handle assignees."
* **Conflict Prevention:** Most conflicts never occur because users coordinate proactively.

**UX Highlights:**
* Unread badges ensure messages are seen.
* Auto-scrolling keeps conversations flowing.
* Empty-state messaging explains collaboration purpose.
* Chat auto-cleans when the task is saved or closed.

### Layer 2: Infrastructure-Level Resolution — "When Prevention Fails"

Even with prevention, edge cases happen. This layer ensures technical correctness without disrupting the experience.

**Optimistic UI & Smart Rollback:**
* Immediate visual feedback without waiting for the server.
* Backend detects version conflicts and rolls back gracefully if needed.
* localStorage preserves edits even through refreshes.

**Backend Conflict Resolution:**
* Tracks active editors in real-time.
* Notifies all editors when someone joins or leaves.
* Routes chat messages to all active editors reliably.

### Why This Two-Layer Approach Works

* **Prevention** handles ~90% of conflicts through human coordination.
* **Resolution** handles the remaining ~10%, covering edge cases and network issues.

**Psychological Impact:**

**Before:** "Someone else is editing this task. Please try again later." → Frustrating

**After:** "Sarah is also editing this task. Want to coordinate?" → Collaborative

The result is smooth, frictionless teamwork. Conflicts are no longer blockers; they become opportunities for collaboration.

---

### View Task Modal

![View task modal](/task-board-images/view-modal.png)
*View Task Modal - Full details, attachments, and activity history*

**What it does:** This read-only modal displays comprehensive task information including full description, all attachments, complete activity history, and subtask details. The content shown adapts based on the viewer's access level and the task's visibility settings.

**Key features:** Context-aware content display based on permissions, full attachment gallery with preview capabilities, complete task activity timeline, subtask management, and adaptive UI that respects visibility controls.

---

## CAP Theorem Trade-offs - Theory Meets Reality

Building a collaborative task board means making hard choices about consistency, availability, and partition tolerance. Here's how I approached each type of operation and why.

### 1. Write Operations — Consistency > Availability

**Operations:** Edit Task, Create Task, Delete Task/Column, Rename Column, Create Board, Move Tasks

**Decision:** Consistency over Availability

For write operations, I prioritize data correctness over speed. When someone creates a task or moves it to a different column, that change must be immediately visible to everyone else. Inconsistent state in collaborative tools leads to confusion, duplicate work, and lost changes.

#### What if we flipped it? (Availability over Consistency)

If I prioritized availability for writes, users could perform actions even during network partitions, but they might create conflicting changes that are painful to resolve later. Imagine two people moving the same task to different columns simultaneously, or editing the same description with conflicting changes.

**Trade-off:** Network partitions might temporarily block some write operations. However, users get clear feedback about what's happening rather than silent failures or confusing conflicts.

#### Mitigation

I use optimistic UI updates to make operations feel fast while ensuring consistency. The interface responds immediately to user actions, but can roll back if the server rejects the change. This gives the best of both worlds - responsive UI with reliable data.

### 2. Read Operations — Availability > Consistency

**Operations:** Loading board, viewing tasks/columns

**Decision:** Availability over Consistency

For reads, my priority flips. Users can tolerate slightly stale data for a second, but they cannot wait for the board to load. Availability is king here.

#### Reasoning

Collaborative tools succeed when they feel responsive. A board that takes 3+ seconds to load kills productivity. Users will refresh the page, think the app is broken, or switch to something else.

**Trade-off:** Users may see data slightly out of date (eventual consistency).

#### Mitigation

I use aggressive caching with real-time push updates via WebSockets. This means reads are lightning-fast from cache, but any changes get pushed to all clients immediately, self-correcting the UI within milliseconds.

### 3. Real-Time Task Broadcasting — Eventual Consistency (Chosen)

**Operations:** Showing added/edited tasks to other users without a page refresh

#### Key constraint

Real-time updates must not slow down the user who made the change.

#### Option A → Full Consistency

Wait for all connected clients to acknowledge receipt before confirming the change.

**Drawback:** if even one client is slow, everyone else is blocked. The board feels sluggish.

#### Option B → Eventual Consistency (Chosen)

Confirm the write to the database immediately, then broadcast to clients asynchronously.

**Result:** some clients may see updates slightly later, but the write is always fast for the person making the change.

**Trade-off:** not every user sees the update at exactly the same moment, but the user experience stays fluid for everyone.

### Framing Note

These aren't just academic trade-offs. In a collaborative tool, user psychology matters as much as technical correctness. A system that's technically perfect but feels slow will be abandoned. A system that's eventually consistent but feels responsive will be adopted and loved.

---

## Implementation Strategies - From Theory to Code

Here's how I translated CAP theorem decisions into actual technical implementations.

### 1. Write Operations — Consistency > Availability

**Decision:** Synchronous Database Replication

When a user creates a task, moves it, or edits it, the write must succeed on the primary database and at least one replica before returning success to the client.

This guarantees that any subsequent read (from any database replica) will see the change immediately.

#### How it works:

- When a write occurs, every replica is updated before returning success.
- Any subsequent read from any replica sees the same committed state.

This approach trades some latency for consistency, but ensures collaborative correctness.

#### Alternative Considered → Single Database for All Reads/Writes

I considered using a single database to eliminate consistency concerns entirely.

**Why I rejected it:**

- If that single database fails, the whole app is down.
- Reads are extremely frequent (every drag, refresh, and load). Combining them with writes risks overwhelming the database.
- That bottleneck surfaces fast in a collaborative environment and kills UX.

#### Reflection

Even though a single database seems "simpler," it's fragile at scale. Synchronous replication adds complexity, but it preserves both trust and stability — exactly what users need.

### 2. Read Operations — Availability > Consistency

**Decision:** Multi-source reads + caching + push updates

For reads, my priority flips. Users can tolerate slightly stale data for a second, but they cannot wait for the board to load. Availability is king here.

Here's the flow I chose:

- Attempt to read from Redis cache first — lightning-fast
- If the cache misses, fallback to database replicas
- Meanwhile, the backend pushes updates via WebSockets so the UI self-corrects as soon as new data arrives

#### Result

Board loads are consistently under 200ms, even with hundreds of tasks. Users get immediate feedback, and any stale data self-corrects within milliseconds via push updates.

#### Reflection

This felt like cheating at first — serving potentially stale data. But in practice, the combination of fast cache reads plus real-time push updates creates an experience that feels both instant and correct.

---

## Deep Dive: Optimistic UI Updates

Optimistic UI is one of the most effective techniques to make collaborative apps feel fast and fluid. Instead of waiting for the backend to confirm, the UI assumes the operation will succeed and updates instantly. This makes the app feel snappy and responsive — but it comes with trade-offs I needed to handle carefully.

### Where Optimistic UI Applies

I apply optimistic UI only for write operations that are frequent and lightweight, such as:

- **Creating tasks**
- **Editing task details**
- **Moving tasks between columns**
- **Completing subtasks**

These are the high-velocity actions that users expect to be near-instant.

### Where Optimistic UI Does Not Apply

I deliberately avoid optimistic UI for "Create Board" and "Add Column." Why?

- These operations often trigger immediate dependent actions. For example, after adding a column, users might drag tasks into it. If the column was optimistic and later rolled back, it would create a chain of confusing reversals.
- Boards and columns are created infrequently. Even if latency is slightly higher, the trade-off is acceptable for the clarity it brings.

**The rule of thumb:** optimistic UI for fast, frequent edits; backend-confirmed UI for structural actions.

### The Optimistic UI Flow

1. **User initiates a write** (e.g., creates a new task)
2. **Frontend immediately updates the UI** as if the task exists
3. **The task is temporarily stored in local storage** so the state persists even if the user refreshes
4. **A request is fired off to the backend** in parallel
5. **When backend confirms success:**
   - Instead of throwing away the optimistic task and re-rendering from scratch, I merge backend data into the optimistic item
   - This avoids flicker or duplication and ensures IDs or server-side fields (e.g., timestamps, user IDs) are updated correctly

### Safeguards: Handling Failures & Delays

Optimistic UI feels magical when everything works, but I needed to handle the edge cases:

#### Rollback on failure

If the backend responds with an error (e.g., validation failed, permission denied), I roll back the optimistic change and surface a clear message to the user.

#### Timeout window

Every optimistic update has a window of trust — 10 seconds.

If the backend response doesn't arrive within this window, I assume something went wrong and rollback the optimistic state.

If the response arrives after the window (say at 11s), I don't blindly apply it. Instead:

- Check if the optimistic state was already rolled back
- If yes → discard the late response, since the UI state has already been reconciled
- If no → merge it safely, but still log/flag the latency for monitoring

This ensures users don't see inconsistent UI or "ghost" updates arriving long after they've moved on.

### Why This Works

- **Collaboration is preserved** — users see changes immediately without waiting for network round-trips
- **Reliability is maintained** — rollbacks handle failures gracefully
- **Performance feels instant** — even on slow networks, the UI responds immediately
- **State persistence** — optimistic changes survive page refreshes via localStorage

### The Psychological Impact

The most surprising discovery was the psychological effect. Users didn't just tolerate the occasional rollback — they preferred the immediate feedback so much that rare rollbacks felt like minor glitches rather than major problems.

The app feels responsive and trustworthy because it reacts instantly to user actions, even when the network is slow.

---

## Deep Dive: Caching Layer

Caching in a collaborative environment is tricky. Here's how I balanced speed with correctness:

### What to Cache

I had to carefully decide what data belonged in cache vs. what should always come fresh from the database.

#### Boards → names only

Users switch between boards frequently, so board names need to load instantly. But board metadata (members, permissions) can be fetched on-demand.

#### Columns → all of them, regardless of viewport

Column operations are rare but affect the entire board structure. Cache all columns for any board that's actively being viewed.

#### Tasks → only those visible in the viewport on load

This was the key insight. Instead of caching all tasks (memory intensive) or no tasks (slow), I cache just the tasks visible when the board loads:

- Name
- Description preview
- Attachment count
- Subtask count
- Assignee

This ensures fast first paint without bloating memory with hidden details.

### Eviction Policy

**Chosen Strategy:** LRU (Least Recently Used) + TTL (Time To Live)

- **LRU** keeps the most active boards and tasks in memory, matching how users work.
- **TTL** guarantees that entries eventually refresh, preventing stale data from lingering in a collaborative session.

### Cache Invalidation

**Chosen Strategy:** Active Invalidation + TTL fallback

#### How it works:

1. A user performs a write (e.g., move a task, edit a title, rename a column).
2. Backend updates the database.
3. Backend publishes an event via Pub/Sub: "Task X moved to Column Y."
4. Subscribed caches and frontend clients immediately update or invalidate relevant entries.
5. If the invalidation is missed, TTL ensures eventual refresh.

#### Why this works:

- Real-time collaboration is guaranteed — no waiting for TTL.
- Reads remain fast with cache-first logic.
- Scales cleanly in distributed environments.

### Key Notes

- TTL is a safety net, not the main strategy. Relying solely on TTL would break collaboration because users wouldn't see changes immediately.
- Collaboration trumps latency alone. Cache exists to make reads fast without sacrificing real-time correctness. Active invalidation is non-negotiable here.

---

## Concurrency Control - When to Lock vs. When to Flow

Different operations need different approaches to handle multiple users working simultaneously.

### 1. Column-Level Actions (Rename Column, Delete Column, Create Column)

**Strategy:** Pessimistic Locking

#### Why locking here?

- These actions are structural: renaming or deleting a column affects the organization of tasks for every collaborator
- They are also rare events. Users create, rename, or delete columns infrequently compared to task edits
- Because they're rare, users can tolerate a short block—filling one field or confirming deletion while the system ensures no one else is making a conflicting change

**In this case, simplicity > concurrency.** Instead of building conflict resolution logic for such rare operations, I opt for straightforward pessimistic locking. It guarantees clarity and prevents messy edge cases like two users renaming the same column differently at the same moment.

### 2. Task-Level Actions (Edit Task, Move Task, Change Assignee)

**Strategy:** Let Conflicts Happen + Resolve

- Task interactions are high-frequency, fine-grained, and highly concurrent
- Multiple users often edit different parts of the same task at once—one updates the description, another adds an assignee, a third reorders the task
- If we applied pessimistic locking here, the result would be constant blocking for collaborators and a degraded user experience where people feel like they're "waiting in line" to use the app

**Here, fluid collaboration > strict control.** Collaboration tools succeed when they feel real-time and effortless. Occasional conflict resolution is less damaging than constant friction from locks.

### Why This Split Strategy Works

It recognizes that **different operations have different collaboration patterns:**

- **Structural changes** (columns) are strategic decisions that should be deliberate
- **Content changes** (tasks) are tactical work that should flow freely

By matching the concurrency strategy to the operation type, I get the best of both worlds: structural integrity where it matters, and collaborative fluidity where it counts.

---

## Performance Targets & Monitoring

Real-time collaboration systems need tight performance bounds. Here's what I aimed for and how I track it:

### Target Response Times

**Task Operations:** < 200ms from action to server response
- Task creation, editing, movement, deletion
- Critical because these happen constantly during active collaboration

**Board Operations:** < 500ms from action to server response
- Board loading, column operations, member management
- Less frequent but still important for perceived responsiveness

**Search & Filtering:** 300ms debounced for optimal UX
- Search-as-you-type filtering with smart debouncing
- Priority/assignee filtering (instant local operations)
- Balances responsiveness with performance efficiency

### Monitoring & Alerting

#### Performance Monitoring Implementation

**SLA Tracking & Violations:**
- Task operations: < 200ms threshold with automated violation tracking
- Board operations: < 500ms threshold with compliance reporting
- Real-time performance headers in HTTP responses
- Automatic rollback detection for optimistic UI failures

**Health Monitoring:**
- WebSocket connection registry and room management
- Gateway load balancer health checks
- Redis connectivity and pub/sub monitoring
- Circuit breaker patterns for service degradation

**Analytics & Metrics:**
- Request duration percentiles (P95, P99)
- Operation-specific performance categorization
- Memory usage and CPU performance tracking
- Migration success rates and connection rebalancing

### Performance Insights

**What I learned:** The perceived performance matters more than absolute performance. A 300ms operation that gives immediate visual feedback feels faster than a 200ms operation with no visual response.

This is why optimistic UI updates are crucial — they make the app feel instant even when the network is slow.

---

## Lessons Learned That Changed How I Build

This project forced me to think beyond features and into the human realities of collaboration. I'll carry these lessons into every system I design.

### 1. Prevention Beats Resolution

I thought conflict resolution was enough. It isn't. Adding in-modal chat and presence indicators showed me the real win: prevent conflicts before they happen.

Even if conflict resolution is inevitable, layering in prevention minimizes the number and severity of conflicts that reach the resolution stage. It shifts the dynamic from firefighting to flow.

### 2. Visibility Is Power and Risk

Transparency empowers teams, but unchecked visibility creates security and trust issues. The balance between power and risk is where trust is built.

### 3. Perception Is Performance

Raw latency numbers (<200ms, <500ms) don't mean much on their own—perception is everything. What matters is how users experience responsiveness. Some won't notice half a second of delay, while others will feel it immediately. The real lesson: don't just optimize for metrics, optimize for psychology.

Psychology of the target users: speed is experienced, not measured.

### 4. Complexity Comes at a Cost, Is it Worth It?

Every fix introduces complexity. The real question is whether that complexity creates lasting value or just short-term relief. The key is having the judgment to tell whether it's necessary or unnecessary, and only paying the cost when it's worth it.

### The Core Shift

The biggest lesson wasn't technical—it was human. Building for humans forces you to consider psychology first, then shape the technical decisions around it. The right architecture is the one that serves human trust, perception, and flow.