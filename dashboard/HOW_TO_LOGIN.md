# 🔐 Login & Signup Guide

## ✅ **New Features Added!**

Your dashboard now has:
- ✅ **Create Account** - Register new users
- ✅ **Real Login** - Validates email/password
- ✅ **Save Credentials** - Stores accounts locally
- ✅ **Error Handling** - Shows validation messages

---

## 🎯 How to Use

### **Option 1: Create a New Account** (Recommended)

1. **Open**: http://localhost:5173
2. You'll see the login page
3. Click **"Don't have an account? Create one"** at the bottom
4. **Fill in the form**:
   - Email: `your@email.com`
   - Password: `password123` (min 6 characters)
5. Click **"Create Account"**
6. ✅ **Success!** Message shows: "Account created successfully!"
7. Automatically switches to login screen
8. **Login** with your email and password
9. ✅ **You're in!**

### **Option 2: Login with Existing Account**

1. **Open**: http://localhost:5173
2. **Enter** your email and password
3. Click **"Sign In"**
4. ✅ **Dashboard opens!**

---

## 📝 Examples

### **Create Account**
```
Email: john@example.com
Password: mypassword123
→ Click "Create Account"
→ ✅ Account created!
```

### **Login**
```
Email: john@example.com
Password: mypassword123
→ Click "Sign In"
→ ✅ Dashboard opens!
```

---

## 🔒 Security Features

### **Validation:**
- ✅ Email must be valid format (contains @)
- ✅ Password minimum 6 characters
- ✅ Both fields required

### **Error Messages:**
- ❌ "Please enter both email and password"
- ❌ "Please enter a valid email address"
- ❌ "Password must be at least 6 characters"
- ❌ "An account with this email already exists"
- ❌ "Invalid email or password"

### **Success Messages:**
- ✅ "Account created successfully! You can now login."

---

## 💾 How It Works

### **Data Storage:**
Your account is saved in **localStorage** (browser storage):

```javascript
{
  id: "123456789",
  email: "john@example.com",
  password: "mypassword123",
  name: "john",
  role: "admin",
  createdAt: "2026-08-21T..."
}
```

**Persists across sessions!**
- Close browser → Open again → Still logged in ✅
- Same computer/browser → Your account is saved ✅

---

## 🎨 UI Flow

### **Login Screen:**
```
┌─────────────────────────────────┐
│        Storyly                  │
│  Sign in to your dashboard      │
│                                 │
│  Email                          │
│  ┌───────────────────────┐     │
│  │ you@example.com       │     │
│  └───────────────────────┘     │
│                                 │
│  Password                       │
│  ┌───────────────────────┐     │
│  │ ••••••••              │     │
│  └───────────────────────┘     │
│  Minimum 6 characters           │
│                                 │
│     [    Sign In    ]           │
│                                 │
│  Don't have an account?         │
│  Create one                     │
└─────────────────────────────────┘
```

### **Signup Screen:**
```
┌─────────────────────────────────┐
│        Storyly                  │
│   Create your account           │
│                                 │
│  Email                          │
│  ┌───────────────────────┐     │
│  │ you@example.com       │     │
│  └───────────────────────┘     │
│                                 │
│  Password                       │
│  ┌───────────────────────┐     │
│  │ ••••••••              │     │
│  └───────────────────────┘     │
│  Minimum 6 characters           │
│                                 │
│  [  Create Account  ]           │
│                                 │
│  Already have an account?       │
│  Sign in                        │
└─────────────────────────────────┘
```

---

## ✨ Features

### **Toggle Between Login/Signup:**
- Click "Create one" → Switches to signup
- Click "Sign in" → Switches to login
- Form clears when switching

### **Smart Validation:**
- Email format check (must have @)
- Password length check (min 6 chars)
- Duplicate email check (can't create twice)
- Wrong password detection

### **User Friendly:**
- Clear error messages
- Success confirmation
- Auto-redirect after signup
- Remember login state

---

## 🚀 Try It Now!

**Step 1:** Refresh the dashboard page
```
http://localhost:5173
```

**Step 2:** Create your account
```
1. Click "Don't have an account? Create one"
2. Enter your email
3. Enter password (min 6 characters)
4. Click "Create Account"
```

**Step 3:** Login
```
1. Use the same email/password
2. Click "Sign In"
3. You're in the dashboard!
```

---

## 🔄 Multiple Accounts

You can create **multiple accounts**:

**Account 1:**
```
Email: admin@storyly.com
Password: admin123
```

**Account 2:**
```
Email: user@storyly.com  
Password: user123
```

**Switch accounts:**
1. Logout from dashboard (top right)
2. Login with different credentials

---

## 💡 Tips

### **Forgot your password?**
Since it's stored locally, you can:
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Find key: `storyly_users`
4. See your password (in JSON)

### **Reset everything?**
```javascript
// In browser console:
localStorage.removeItem('storyly_users')
localStorage.removeItem('auth-storage')
```

### **See all accounts?**
```javascript
// In browser console:
JSON.parse(localStorage.getItem('storyly_users'))
```

---

## 📊 What's Saved

When you create an account, this is saved:
```json
{
  "id": "1724253600000",
  "email": "john@example.com",
  "password": "mypassword123",
  "name": "john",
  "role": "admin",
  "createdAt": "2026-08-21T10:30:00.000Z"
}
```

When you login, this is stored in session:
```json
{
  "user": {
    "id": "1724253600000",
    "email": "john@example.com",
    "name": "john",
    "role": "admin"
  },
  "token": "mock-token-1724253600000",
  "isAuthenticated": true
}
```

---

## ✅ Complete!

Your dashboard now has:
- ✅ Real user registration
- ✅ Real login validation
- ✅ Password authentication
- ✅ Persistent accounts
- ✅ Error handling
- ✅ Success messages

**No backend needed** - everything works in your browser! 🎉

Later, when you add the backend, we can migrate to real API authentication.
