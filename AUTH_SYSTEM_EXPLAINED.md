# Authentication System — Complete Explanation

A full breakdown of how the Sign Up, Login, JWT, password hashing, and MongoDB storage
work in this project. Written so anyone can understand it, even without prior experience.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Sign Up Flow](#sign-up-flow)
3. [Password Hashing with bcrypt](#password-hashing-with-bcrypt)
4. [What Gets Stored in MongoDB](#what-gets-stored-in-mongodb)
5. [MongoDB _id — How it is Generated](#mongodb-_id--how-it-is-generated)
6. [Login Flow](#login-flow)
7. [JWT — JSON Web Token](#jwt--json-web-token)
8. [Token Storage and Auth Persistence](#token-storage-and-auth-persistence)
9. [Protected Routes](#protected-routes)
10. [Public Routes](#public-routes)
11. [Logout](#logout)
12. [Full Flow Summary](#full-flow-summary)

---

## Project Structure

```
AuthLogin/
├── backend/                        ← Node.js + Express API server
│   ├── server.js                   ← Entry point, starts the server
│   ├── .env                        ← Secret config (MongoDB URI, JWT secret)
│   └── src/
│       ├── config/db.js            ← Connects to MongoDB Atlas
│       ├── models/User.js          ← User schema + bcrypt password hashing
│       ├── middleware/auth.js      ← JWT verification middleware
│       └── routes/auth.js         ← /signup, /login, /me endpoints
│
└── frontend/                       ← React app (Vite + TypeScript)
    └── src/
        ├── App.tsx                 ← All routes defined here
        ├── services/api.ts         ← Axios setup, auto-attaches JWT to requests
        ├── context/AuthContext.tsx ← Global auth state (user, login, logout)
        ├── components/
        │   ├── Navbar.tsx          ← Shows Login/Signup OR Logout button
        │   ├── ProtectedRoute.tsx  ← Blocks unauthenticated users from /dashboard
        │   └── PublicRoute.tsx     ← Blocks authenticated users from /login, /signup
        └── pages/
            ├── SignUp.tsx          ← Sign up form
            ├── Login.tsx           ← Login form
            └── Dashboard.tsx       ← Protected dashboard page
```

---

## Sign Up Flow

### Step 1 — User fills the form

The user provides:
- Username
- Email address
- Password
- Confirm password

### Step 2 — Client-side validation (frontend)

Before even sending a request, the frontend checks:
- No fields are empty
- Username is at least 3 characters
- Password is at least 6 characters
- Password and confirm password match

If any check fails, an error message is shown immediately without hitting the server.

### Step 3 — Request sent to backend

```
POST /api/auth/signup
Body: { username, email, password }
```

### Step 4 — Server-side validation (backend)

The backend runs its own validation using `express-validator`:
- Is the email a valid format?
- Is the password at least 6 characters?

This is important because someone could bypass the frontend and send requests directly.

### Step 5 — Duplicate email check

```js
const existingUser = await User.findOne({ email });
if (existingUser) {
  return res.status(409).json({ message: 'An account with this email already exists.' });
}
```

MongoDB is queried to see if that email already exists. If it does, a 409 Conflict error
is returned and no duplicate account is created.

### Step 6 — User is saved to MongoDB

```js
const user = await User.create({ username, email, password });
```

Before the password is saved, it goes through bcrypt hashing (explained in the next section).

### Step 7 — Response and redirect

The backend returns:
```json
{
  "message": "Account created successfully.",
  "user": { "_id": "...", "username": "john", "email": "john@example.com" }
}
```

Note: **no JWT token is returned on signup**. The user is redirected to the Login page.

---

## Password Hashing with bcrypt

This is the most critical security step. Passwords are **never stored as plain text**.

### What is bcrypt?

bcrypt is a password-hashing algorithm designed specifically for storing passwords securely.
It is intentionally slow, which makes brute-force attacks very expensive.

### How it works in the code

In `models/User.js`, a pre-save hook runs automatically before every save:

```js
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return; // only hash if password changed

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});
```

**Step by step:**

1. `bcrypt.genSalt(12)` — generates a random salt string. The number 12 is the "cost factor",
   meaning bcrypt runs 2¹² = 4096 hashing iterations. Higher = slower = more secure.

2. `bcrypt.hash(password, salt)` — combines the plain text password with the salt and
   produces a hash string like:
   ```
   $2b$12$eW3x9K1mPQz8vLhN2uOAuHkT5gRpXwYmZcVbNsDfJqKlMnOpQrSt
   ```

3. This hash **replaces** the plain text password before it is saved to MongoDB.

### Why is this secure?

- The hash cannot be reversed — you cannot get the original password back from the hash
- Every user gets a different salt even if they use the same password
- If the database is stolen, attackers cannot read any passwords
- bcrypt is designed to be slow — cracking one password takes a long time

### How login comparison works

When a user logs in, bcrypt re-hashes the entered password with the same salt that is
embedded in the stored hash, then compares:

```js
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
```

`bcrypt.compare` returns `true` if the passwords match, `false` if not.

---

## What Gets Stored in MongoDB

After a successful signup, one document is created in the `users` collection:

```json
{
  "_id": "685f3a2c4e1d8b0012ab34cd",
  "username": "john",
  "email": "john@example.com",
  "password": "$2b$12$eW3x9K1mPQz8vLhN2uOAuHkT5gRpXwYmZcVbNsDfJqKlMnOpQrSt",
  "createdAt": "2026-10-01T14:23:00.000Z",
  "updatedAt": "2026-10-01T14:23:00.000Z"
}
```

Key points:
- `password` is the bcrypt hash, never the original password
- `createdAt` and `updatedAt` are added automatically by Mongoose (`timestamps: true`)
- The `toJSON()` method on the model strips the password field before sending it to the frontend

### Where to view it

1. Go to cloud.mongodb.com
2. Click Browse Collections on your cluster
3. Open the `authlogin` database → `users` collection

---

## MongoDB _id — How it is Generated

MongoDB automatically generates `_id` for every document. You never write code for it.

The `_id` is of type **ObjectId** — a 24-character hex string made of 12 bytes:

```
685f3a2c  |  4e1d8b  |  0012  |  ab34cd
─────────────────────────────────────────
4 bytes      3 bytes   2 bytes   3 bytes
timestamp    machine   process   counter
             ID        ID
```

| Part | Description |
|---|---|
| First 4 bytes | Unix timestamp — seconds since January 1, 1970 |
| Next 3 bytes | Hash of the server's hostname/machine ID |
| Next 2 bytes | Process ID of the running Node.js process |
| Last 3 bytes | A random incrementing counter |

### Why this design?

- **Globally unique** — two servers creating documents at the same millisecond will never produce the same ID
- **No central counter** — unlike SQL's AUTO_INCREMENT, no database round-trip is needed to get the next ID
- **Creation time is embedded** — you can extract the timestamp from any `_id`:
  ```js
  user._id.getTimestamp() // → 2026-10-01T14:23:00.000Z
  ```

---

## Login Flow

### Step 1 — User submits credentials

```
POST /api/auth/login
Body: { email, password }
```

### Step 2 — Find user by email

```js
const user = await User.findOne({ email }).select('+password');
```

If no user is found → return `"Invalid email or password."`

Note: the same error message is used whether the email doesn't exist or the password
is wrong. This prevents attackers from knowing which emails are registered.

### Step 3 — Compare password

```js
const isMatch = await user.comparePassword(password);
if (!isMatch) {
  return res.status(401).json({ message: 'Invalid email or password.' });
}
```

### Step 4 — Generate JWT

If credentials are correct, a JWT is generated and sent back:

```js
const token = jwt.sign(
  { id: user._id },        // payload stored inside the token
  process.env.JWT_SECRET,  // secret key used to sign
  { expiresIn: '7d' }      // token expires in 7 days
);
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": { "_id": "...", "username": "john", "email": "john@example.com" }
}
```

---

## JWT — JSON Web Token

### What is a JWT?

A JWT is a self-contained signed token used to prove identity without hitting the database
on every request. It has three parts separated by dots:

```
eyJhbGciOiJIUzI1NiJ9  .  eyJpZCI6IjY0YWJjMTIzIn0  .  xK9mP2qRzLvN8wT
──────────────────────    ───────────────────────────    ────────────────
      HEADER                      PAYLOAD                   SIGNATURE
```

**Header** — base64 encoded JSON describing the algorithm:
```json
{ "alg": "HS256", "typ": "JWT" }
```

**Payload** — base64 encoded JSON containing the data (claims):
```json
{ "id": "685f3a2c4e1d8b0012ab34cd", "iat": 1727784180, "exp": 1728388980 }
```
- `id` — the user's MongoDB `_id`
- `iat` — issued at (timestamp)
- `exp` — expiry timestamp (7 days from issue)

**Signature** — created by signing `header + payload` with the `JWT_SECRET`:
```
HMACSHA256(base64(header) + "." + base64(payload), JWT_SECRET)
```

If anyone modifies the payload, the signature will not match and the token is rejected.

### Important: JWT payload is readable

The header and payload are only base64 encoded, not encrypted. Anyone can decode them.
**Never store sensitive data like passwords in the JWT payload.**
The signature only proves the token was not tampered with — it does not hide the data.

---

## Token Storage and Auth Persistence

### Where the token is stored

After login, the frontend stores the JWT in `localStorage`:

```js
localStorage.setItem('token', token);
```

`localStorage` persists across page refreshes and browser restarts until explicitly cleared.

### How every request carries the token

The Axios instance in `api.ts` has a request interceptor that automatically adds the token
to every outgoing request:

```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

Every API call will have this header:
```
Authorization: Bearer eyJhbGci...
```

### How auth state is restored on page refresh

When the app loads, `AuthContext.tsx` runs this on mount:

```js
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) { setIsLoading(false); return; }

  authAPI.getMe()           // GET /api/auth/me — verifies token with backend
    .then(res => setUser(res.data.user))   // valid → user is logged in
    .catch(() => localStorage.removeItem('token')); // invalid → clear token
}, []);
```

This is what keeps the user logged in after a refresh. The token is validated with the
backend every time the app starts.

---

## Protected Routes

The `/dashboard` route is protected. Only authenticated users can access it.

```jsx
// In App.tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

`ProtectedRoute.tsx` checks the auth state:

```js
if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
}
```

The backend also protects `GET /api/auth/me` using the `protect` middleware:

```js
// middleware/auth.js
const token = authHeader.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// throws if expired, tampered, or wrong secret
const user = await User.findById(decoded.id);
req.user = user;
```

If the token is invalid or expired, the request is rejected with 401 Unauthorized.

---

## Public Routes

`/login` and `/signup` are public routes but have a twist — if an already-authenticated
user tries to visit them, instead of showing the form, a message is displayed:

```
You are already logged in. Please go to the dashboard.
[ Go to Dashboard ]
```

This is handled by `PublicRoute.tsx`:

```js
if (isAuthenticated) {
  return <AlreadyLoggedInMessage />;
}
return children; // show the login/signup form
```

---

## Logout

Logout is simple because JWT is stateless — the server does not store sessions.

```js
const logout = () => {
  localStorage.removeItem('token'); // remove token from browser
  setUser(null);                     // clear user from React state
  navigate('/login');                // redirect
};
```

Once the token is removed from `localStorage`, no future request will carry it, so the
user is effectively logged out. The token itself still exists until it expires (7 days),
but since it is not sent anywhere, it cannot be used.

---

## Full Flow Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                          SIGN UP                                    │
│                                                                     │
│  User fills form → frontend validates → POST /api/auth/signup       │
│  → backend validates → check duplicate email → User.create()        │
│  → pre-save hook runs → bcrypt hashes password → saved to MongoDB   │
│  → return user (no token) → redirect to /login                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                           LOGIN                                     │
│                                                                     │
│  User enters credentials → POST /api/auth/login                     │
│  → find user by email → bcrypt.compare(entered, storedHash)         │
│  → if match → jwt.sign({ id }) → return { token, user }             │
│  → frontend stores token in localStorage → navigate to /dashboard   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                       PAGE REFRESH                                  │
│                                                                     │
│  App loads → AuthContext reads token from localStorage              │
│  → GET /api/auth/me (token in Authorization header)                 │
│  → backend: jwt.verify(token) → find user by id                     │
│  → return user → React state updated → user is still logged in      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     ACCESSING /dashboard                            │
│                                                                     │
│  ProtectedRoute checks isAuthenticated                              │
│  → true  → show Dashboard                                           │
│  → false → redirect to /login                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          LOGOUT                                     │
│                                                                     │
│  localStorage.removeItem('token') → setUser(null) → /login         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Key Technologies Used

| Technology | Purpose |
|---|---|
| **Express.js** | Backend web framework — handles HTTP routes |
| **MongoDB Atlas** | Cloud database — stores users |
| **Mongoose** | MongoDB object modeling — schemas, models, hooks |
| **bcryptjs** | Password hashing — never store plain text passwords |
| **jsonwebtoken** | Generate and verify JWTs |
| **express-validator** | Server-side input validation |
| **React** | Frontend UI framework |
| **React Router** | Client-side routing (/signup, /login, /dashboard) |
| **Axios** | HTTP client — makes API requests from frontend |
| **localStorage** | Browser storage — persists JWT across page refreshes |
| **Vite** | Frontend build tool and dev server |

---

*Document prepared for the AuthLogin project — October 2026*
