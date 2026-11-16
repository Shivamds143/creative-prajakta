# GiftAura (Next.js 14 + MongoDB)
1. `npm install`
2. `cp .env.example .env.local` and set MONGODB_URI (local or Atlas)
3. `npm run seed` (optional – without a DB, built-in sample data is used)
4. `npm run dev` → http://localhost:3000
Routes: `/`, `/shop?occasion=Diwali`, `GET /api/products?category=Hampers`
