# Style E-commerce App

## Introduction

Style is a clothing e-commerce application where users can browse and purchase items across men's, women's, and kids' categories. Users can view detailed product information, and add items to their shopping cart with specific size and quantity selections. Users perform payments via Stripe and can view their purchase history.

## Tech Stack

**Frontend:** React, Redux, Styled Components  
**Payment:** Stripe  
**Backend:** Node.js, Express.js  
**Database:** MongoDB Atlas

---

## Inventory Management

### Problem Statement

When designing the inventory management system for Style e-commerce, the first issue I encountered was the typical challenge of avoiding overselling within a high-concurrency environment, where several users could potentially buy the same item at the same time. I needed a solution that could handle race conditions while maintaining data consistency and system performance.

### Solutions I Considered and Rejected

**Database-Only Locking Approach**

I initially considered using simple database row-level locking. I rejected this approach because it would cause bottlenecks during flash sales. The locks would be held for too long, leading to timeouts and a poor user experience.

**Optimistic Concurrency**

I considered implementing version-based optimistic locking in isolation without distributed coordination. I rejected this approach since, while it may work well under normal traffic, it would produce excessive retries and a poor user experience during high-demand periods.

### My Preferred Solution: Adaptive Dual-Strategy System

I designed an inventory system that adapts to real-time demand. A Redis-based heat detection engine tracks product activity, and if an item receives more than 10 requests in a minute, it's flagged as "hot." Normal items are handled with optimistic concurrency and retries, which provides fast performance for everyday shopping. Hot items, on the other hand, switch to distributed locking with priority queues.