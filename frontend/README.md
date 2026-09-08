# ShopSphere Frontend

React + Vite frontend for the supplied MERN e-commerce backend.

## Run

```bash
npm install
npm run dev
```

The frontend expects the backend at:

```text
http://localhost:5000/api
```

Change `VITE_API_URL` in `.env` if your backend uses another port.

## Important backend compatibility notes

The supplied backend currently has several route/import/controller mismatches. The frontend is written for the intended API paths, but these backend issues must be fixed before every feature can work:

- `authMiddleware` is exported differently from some routes that import `{ protect }`.
- Several route files reference nonexistent middleware/controller/validation filenames.
- `productController` exports `searchProduct` even though it defines `getProductById`.
- `server.js` has duplicate/misordered `cors` declarations.
- Category routes currently have no `GET /api/categories` list endpoint, while the admin frontend expects one.
- Order status casing is inconsistent between the model and admin controller.
- Order controller imports lowercase model filenames that do not match the supplied model filenames.
- Address/order field names are inconsistent in the backend.
- Razorpay webhook/controller filenames are inconsistent.

The frontend itself is complete and organized around the backend's intended REST API.
