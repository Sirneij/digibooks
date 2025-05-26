# Project Specification: Simple Digital Books App with SvelteKit & Stripe

## 1. Project Goal

To build a minimalist digital books application using SvelteKit to demonstrate Stripe integration for purchasing digital goods. The application will allow users to browse books, add them to a cart, and purchase them using Stripe. Access to purchased content will be granted based on the email provided during checkout.

## 2. Core Features

### 2.1. Book Catalog

- Display a list of available digital books.
- Each book entry should show:
  - Title
  - Author
  - Cover Image (URL)
  - Price
- Allow users to view more details for a single book (e.g., a longer description).

### 2.2. Shopping Cart

- Users can add books from the catalog to a shopping cart.
- Users can view the contents of their shopping cart.
- Users can remove books from their shopping cart.
- The cart should display the subtotal and total price.

### 2.3. Stripe Checkout

- Initiate a Stripe Checkout session for the items in the cart.
- Stripe Checkout should collect the customer's email address.
- Handle redirection to a success page upon successful payment.
- Handle redirection to a failure/cancellation page if payment is not completed.

### 2.4. Content Access (Post-Payment)

- Provide a mechanism for users to access their purchased digital content.
- Access will be granted by users providing the email address they used during the Stripe Checkout process.
- The system will look up purchases associated with that email.

### 2.5. Stripe Webhooks

- Implement a backend endpoint to receive and securely validate Stripe webhook events.
- Specifically, listen for `checkout.session.completed` events.
- Upon successful validation of a `checkout.session.completed` event:
  - Record the purchase in the database, associating the purchased book(s) with the customer's email.

## 3. Technical Stack (Key Components)

- **Frontend/Full-stack Framework:** SvelteKit
- **Payment Processing:** Stripe SDK (Stripe.js for client-side, `stripe` npm package for server-side)
- **Database:** SQLite
- **ORM:** Drizzle ORM

## 4. Data Model (Simplified)

- **Books Table:**

  - `id` (Primary Key)
  - `title` (Text)
  - `author` (Text)
  - `description` (Text, optional)
  - `coverImageUrl` (Text, optional)
  - `priceInCents` (Integer)

- **Purchases Table:**
  - `id` (Primary Key)
  - `customerEmail` (Text) - Email from Stripe Checkout
  - `bookId` (Foreign Key to Books table)
  - `purchasedAt` (Timestamp)
  - `stripeCheckoutSessionId` (Text, Unique) - For idempotency and reference

## 5. Exclusions (Out of Scope for this Demo)

- User accounts and authentication (login/signup).
- Complex order management system (e.g., order history dashboards).
- Physical product shipping.
- Advanced analytics or reporting.
- User reviews or ratings.
