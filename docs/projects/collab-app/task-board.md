# The Task Board

![Task board full view](/assets/projects/collab-app/task-board/task-board-full-view.webp)
*The complete task board interface*

> 🕵️ **Spoiler:** Notice the "AI generated" badge on the first task? When teams chat naturally in the integrated messaging system, AI analyzes conversations and automatically extracts actionable items as properly formatted tasks.

## Introduction

Every collaborative platform needs a Kanban board, but the real question is: do they all need to feel the same? My goal wasn't just to rebuild what already exists; it was to rethink how a task board could approach it from a different angle that most tools overlook.

**Two features shaped this task board:**

**Visibility Controls when creating a task:** Field-level permissions let you decide exactly what members outside your team can see. This creates the balance between visibility and security, allowing external collaborators to understand progress on tasks without exposing sensitive details.

**Collaborative Editing with Conflict Prevention:** Instead of handling conflicts only after they occur, which often creates even more challenges, I designed a UX that prevents conflicts in the first place (More details in the Modals UI section).

Of course, unique features were only part of the challenge. Thinking of the non-functional requirements introduced a whole new layer of complexity, and getting them right can make or break core functionality.

In this documentation, I'll show how I approached those challenges, the trade-offs I faced, and the alternatives I rejected. This isn't just another Kanban clone.

---

## Functional Requirements

Here's what users can accomplish with this task board system:

### Board Operations

- Create boards with selected team members from the project
- Delete empty boards
- Rename boards

### Task Operations

- Add tasks
- Edit tasks
- View tasks
- Delete tasks
- Drag and drop tasks

### Column Operations

- Add columns
- Rename columns
- Delete empty columns

### Search and Filter

- Search tasks by task name
- Filter by priority
- Filter by assignee

---

## UI Modals

Here's a look at what you don't see in the main task board view: the modal interfaces that open on click to handle detailed task operations.

### Create Task Modal

![Create task modal](/assets/projects/collab-app/task-board/create-task-modal.webp)
*Create Task Modal - Notice the visibility checkboxes at the bottom*

**What it does:** This modal allows users to create new tasks with comprehensive details. The key innovation here is the granular visibility controls at the bottom—those options determine what external team members see for each field (title, description, assignees, attachments).

### ⭐ Deep Dive: The Edit Modal - Multiple Users Editing the Same Task

![Edit task modal with presence](/assets/projects/collab-app/task-board/edit-modal.webp)
*The Edit Modal - When multiple users are editing the same task*

Editing tasks simultaneously is inevitable in collaboration: users get locked out, or the system can let conflicts occur and then resolve them. I designed a two-layer solution that addresses conflicts at both the human and technical levels.

### Layer 1: Prevention Through UX - "Let's Talk First"

**The Problem:** Technical conflict resolution is reactive. By the time conflicts occur, the system tries to fix them or relies on locking strategies. But what if we could prevent conflicts before they happen?

**The Solution:** A floating chat automatically appears when multiple users edit the same task.

**How It Works:**
* **Presence Detection:** WebSockets broadcast when a user opens a task 
* **Automatic Chat Activation:** If multiple editors are detected, the TaskEditorChat appears.
* **Real-Time Coordination:** Editors can negotiate edits: "I'll update the description, you handle assignees."
* **Conflict Prevention:** Most conflicts never occur because users coordinate proactively.

### Layer 2: Infrastructure-Level Resolution - "When Prevention Fails"

We cannot rely only on preventing conflicts because we cannot predict what users will do; this is where infrastructure-level resolution comes into play.

**Optimistic Locking with Version Control:** Each task has a version number. When a person updates a task, the system checks the version to detect conflicts. If another person updated it at the same time, the update retries automatically with a small random delay.

**Database Contention Handling:** The system detects conflicts and deadlocks, retries updates with small random delays, and rolls back updates when needed to ensure data consistency.

---

### View Task Modal

![View task modal](/assets/projects/collab-app/task-board/view-modal.webp)
*View Task Modal*

**What it does:** This modal displays task information. The content shown adapts based on the external team member's access level and the task's visibility settings.

---

## CAP Theorem

Building a collaborative task board means making hard choices about consistency and availability during partition tolerance. Here's how I approached each type of operation and why.

### 1. Write Operations - Consistency > Availability

**Operations:** Edit Task, Create Task, Delete Task/Column, Rename Column, Create Board, Move Tasks

**Decision:** Consistency over Availability

For write operations, I prioritize data correctness over performance. For example, when creating a task, such an update must be reflected in what all the others see. Inconsistent state in collaboration tools causes confusion because other users would otherwise see different data.

#### What if we flipped this around? (Availability over Consistency)

If I made writes highly available, there would be the possibility for users to take actions during network splits, and this could lead to conflicting changes that are difficult to reconcile later on. For example, two users might move the same task from one column to another at the same time or change the same description with conflicting updates.

**Trade-off:** Network partitions can cause writes to be temporarily delayed. Users do, however, receive instant feedback about what is happening without silent failures or baffling conflicts.

#### Mitigation

I use optimistic UI updates so that operations are perceived as fast for the user while ensuring consistency. The UI responds to user actions immediately, but backs out on server refusal of the modification. This gives the best of both worlds: responsive UI with assured data.

### 2. Read Operations - Availability > Consistency

**Operations:** checking board data…

**Decision:** Availability over Consistency

For reads, my preference is the other way around. Users will accept slightly stale data, but they cannot tolerate waiting for the board to render. Availability trumps here.

**Trade-off:** Users will sometimes see data that is slightly behind.

#### Mitigation

I use aggressive caching combined with real-time updates via WebSockets. This means reads happen instantly from the cache, and any updates are pushed to all clients right away, keeping the collaboration smooth and consistent.

### 3. Real-Time Task Broadcasting - Eventual Consistency (Chosen)

#### Option A - Full Consistency

Wait for all connected clients to acknowledge receipt before accepting the change.

**Shortfall:** If one client is slow, the others are held up. The board becomes sluggish.

#### Option B - Eventual Consistency (Chosen)

Writes are acknowledged in the database immediately, but updates are broadcast to other clients asynchronously. Some clients might see changes a little later, but the user who made the change experiences no delay.

**Trade-off:** Not everyone sees the update at the exact same moment, but this approach ensures the board remains responsive and avoids slowing down the workflow for anyone.

---

## Implementation Strategies

This is how I connected CAP theorem decisions to technical solutions.

### 1. Write Operations - Consistency > Availability

**Choice:** Synchronous Database Replication

When the user creates, renames, or modifies a task, the master sends the write to replicas. After at least one replica acknowledges receiving the update, the master commits and notifies success to the frontend.

Now, a subsequent read (from any replica database) will see the change take effect immediately.

This approach adds some extra latency for consistency but ensures collaborative correctness.

#### Alternative Considered - Single Database for All Reads/Writes

I considered using a single database to remove consistency issues entirely.

**Why I did not use it:**

- When the single database crashes, the entire application crashes.
- Reads occur very frequently, and combining them with writes can overload and block the database.

### 2. Read Operations - Availability > Consistency

**Choice:** Multi-source reads + caching + push updates

Users can tolerate slightly stale data for a short amount of time for reads. That is preferable to being blocked from reading.

This is the sequence I employed:

- Attempt to read from Redis cache first
- Fall back from cache miss to database replicas
- Meanwhile, the backend pushes updates via WebSockets such that the UI automatically corrects as soon as new data is received.

---

## Deep Dive: Optimistic UI Updates

Instead of waiting for the backend to answer, the UI assumes it will succeed and updates immediately. This keeps the app feeling fast and responsive, though it comes with trade-offs that need careful handling.

### Where Optimistic UI Applies

I apply optimistic UI only to lightweight and frequent write operations such as creating tasks, editing tasks, and moving tasks.

### Where I didn't apply optimistic UI updates

I avoid optimistic UI for "Create Board" and "Add Column." Why?

- These actions can trigger dependent operations; for example, after adding a column, users might immediately drag tasks into it. If the column creation was optimistic and later rolled back, it would create a chain of confusing reversals.
- Boards and columns are created less frequently, so a slight delay is acceptable.

### The Optimistic UI Flow

1. **User performs a write** (e.g., adds a new task)
2. **Frontend updates UI immediately** as if the task is added
3. **The task is temporarily persisted to local storage** to persist on refresh.
4. **The request is sent to the backend.**
5. **When the backend confirms success,** the frontend merges the confirmed data into the optimistic item instead of re-rendering from scratch.

**Note:**
Every optimistic update gets a window of trust: 10 seconds.
If the backend response doesn't come within this window, I roll back the optimistic state.

---

## Deep Dive: Caching Layer

Caching in a multi-user environment is hairy. Here's how I balanced speed against correctness:

### What to Cache

I had to make decisions about what information would be in cache versus what would always come in freshly from the database.

#### Boards - Only Names

Users switch boards frequently, so board names need to load up front. But board metadata (members, permissions) can be loaded on-demand.

#### Tasks - Only the Ones in Viewport on Load

Instead of caching all tasks (memory intensive), I only cache tasks shown when loading the board and only these fields:

- Name
- Description preview
- Attachment count
- Subtask count
- Assignee

### Eviction Policy

**Chosen Strategy:** LRU + TTL

- **LRU** keeps the most recently used boards and tasks in memory to get active items to load quickly.
- **TTL** makes sure cached data is updated in the long term to prevent stale data from remaining in the collaboration process.

### Cache Invalidation

**Chosen Strategy:** Active Invalidation + TTL fallback

#### Operation:

1. An user performs a write (e.g., moves a task, edits a title, renames a column).
2. Backend updates the database.
3. Backend publishes an event using Pub/Sub: "Task X moved to Column Y."
4. Subscribed caches and frontend clients promptly invalidate or update relevant entries.
5. If the invalidation is ignored, TTL ensures eventual refresh.

### Key Note

TTL is a backup, not the first approach. Depending solely on TTL would break coordination because users would not notice changes immediately.

---

## Concurrency Control - When to Lock vs. When to Flow

Different operations need different strategies for handling multiple users working simultaneously.

### 1. Column-Level Operations (Rename Column, Delete Column, Create Column)

**Strategy:** Pessimistic Locking

#### Why lock here?

- Renaming or deleting a column alters the structure of tasks for all collaborators
- They are also rare events. Users rename, create, or delete columns infrequently compared to task edits
- Since they're rare events, users can tolerate a temporary block

Here, instead of building conflict resolution logic for these rare operations, I opt for straightforward pessimistic locking. It guarantees simplicity and prevents unsightly edge cases like having two users rename the same column to two different names at the same time.

### 2. Task-Level Actions (Edit Task, Move Task, Change Assignee)

**Strategy:** Let Conflicts Happen + Resolve

- Task interactions are high-frequency, fine-grained, and highly concurrent
- Multiple users will often change different parts of the same task at the same time. If we employed pessimistic locking here, the result would be frequent blocking for collaborators and a poor user experience where people feel like they're "waiting in line" to use the app.

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

### Monitoring and Alerting

#### Performance Monitoring Implementation

**SLA Tracking and Violations:**
- Task operations: < 200ms threshold with automated violation tracking
- Board operations: < 500ms threshold with compliance reporting
- Real-time performance headers in HTTP responses
- Automatic rollback detection for optimistic UI failures

**Health Monitoring:**
- WebSocket connection registry and room management
- Gateway load balancer health checks
- Redis connectivity and pub/sub monitoring
- Circuit breaker patterns for service degradation

**Analytics and Metrics:**
- Request duration percentiles (P95, P99)
- Operation-specific performance categorization
- Memory usage and CPU performance tracking
- Migration success rates and connection rebalancing

### Performance Insights

**What I learned:** The perceived performance matters more than absolute performance. A 300ms operation that gives immediate visual feedback feels faster than a 200ms operation with no visual response.

This is why optimistic UI updates are crucial — they make the app feel instant even when the network is slow.

---

## Lessons Learned That Changed the Way I Design

Working on this project forced me to think outside features and focus more on the human interaction aspect of collaboration.

### 1. Prevention is Greater Than Resolution

I previously believed that resolving conflicts was enough. It isn't. Adding in-modal chat and presence indicators made me learn the real win: preventing conflicts from happening in the first place.

Even where conflict resolution cannot be avoided, adding prevention reduces the volume of conflicts that need to be handled in the backend.

### 2. Visibility Is Power and Risk

Transparency empowers teams but uncontrolled visibility ruins security and trust.

### 3. Perception Is Performance

Raw latency numbers (<200ms, <500ms) don't mean much in isolation. It's how users feel responsiveness that matters. Some won't mind a half-second lag, while others will notice it instantly. The real takeaway: don't optimize for metrics, optimize for psychology.

### 4. Questioning If the Complexity Is Worth It

Every fix adds more complexity. The real question is whether the complexity provides permanent value or short-term solutions.

### The Core Shift

The biggest lesson wasn't technical; it was human. Designing for humans makes you consider psychology first, and then build the technical choices around it.