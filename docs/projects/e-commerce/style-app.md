# Style E-commerce App

## Introduction

Style is a clothing e-commerce application where users can browse and purchase items across men's, women's, and kids' categories. Users can view detailed product information, and add items to their shopping cart with specific size and quantity selections. Users perform payments via Stripe and can view their purchase history.

## Tech Stack

**Frontend:** React, Redux, Styled Components  
**Payment:** Stripe  
**Backend:** Node.js, Express.js  
**Database:** MongoDB Atlas

---

## Inventory Management System

### The Problem

When multiple customers try to buy the same product at the same time, there's a real risk of overselling—promising more items than we actually have in stock. The challenge was building a system that prevents this without slowing down the shopping experience.

### My Approach

I chose to leverage MongoDB's built-in atomic operations rather than implementing distributed locking mechanisms that could create bottlenecks. The core insight was that MongoDB can check stock availability and decrement inventory in a single, indivisible operation.

Here's how it works: when a customer wants to buy 2 medium-sized shirts, the system performs a single database operation that says "find this product where medium size has at least 2 items in stock, and if found, reduce the stock by 2." If another customer is trying to buy the last 2 medium shirts at the same moment, only one transaction will succeed—the database handles the coordination automatically.

### System Architecture

The inventory system centers around an InventoryService that handles all stock operations. When a customer proceeds to checkout, the system first attempts to reserve the requested items. For a multi-item order, it processes each item sequentially. If any item doesn't have sufficient stock, the system automatically reverses all previous reservations for that order, ensuring we never partially fulfill an order and leave inventory in an inconsistent state.