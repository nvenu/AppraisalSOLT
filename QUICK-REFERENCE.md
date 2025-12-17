# 🚀 Quick Reference Card

## 🔑 Login Credentials (Copy & Paste)

### Employee Logins
```
Junior Developer:
Phone: 1111111111
PIN: 1111

Mid-level Developer:
Phone: 3333333333
PIN: 3333

Senior Developer:
Phone: 5555555555
PIN: 5555
```

### Admin/Manager Login
```
URL: http://localhost:3000/admin
Username: admin
Password: Admin@2024
```

---

## 🔧 Troubleshooting Login Issues

### If login fails with `3333333333/3333`:

**Option 1: Use the Clear Storage Button**
- On the login page, click "🔧 Clear Storage (Troubleshooting)"
- Confirm the action
- Try logging in again

**Option 2: Manual Clear**
1. Press `F12` to open DevTools
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Local Storage** → `http://localhost:3000`
4. Right-click → **Clear**
5. Close DevTools
6. Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
7. Try logging in again

**Option 3: Incognito Mode**
1. Open new incognito/private window
2. Go to `http://localhost:3000`
3. Login with credentials

---

## 📱 Quick Test Flow

### 1. Start App
```bash
npm run dev
```

### 2. Test Junior Developer
- Login: `1111111111` / `1111`
- Submit appraisal with Junior criteria
- Logout

### 3. Test Mid-level Developer
- Login: `3333333333` / `3333`
- Submit appraisal with Mid-level criteria
- Logout

### 4. Test Manager Review
- Go to: `http://localhost:3000/admin`
- Login: `admin` / `Admin@2024`
- Review submitted appraisals
- Rate each criteria
- Complete reviews

### 5. Verify Employee Feedback
- Login as employee again
- Check "Your Appraisals" section
- Expand appraisal to see manager feedback

---

## 📚 Documentation Files

- **README.md** - Complete project documentation
- **DEMO-CREDENTIALS.md** - All test accounts and workflows
- **TESTING-GUIDE.md** - Comprehensive testing scenarios
- **AI-RATING-SYSTEM.md** - AI suggestion feature details
- **EXPERIENCE-BASED-FEATURES.md** - Experience-level features
- **DEPLOYMENT.md** - Deployment instructions
- **CONTRIBUTING.md** - Contribution guidelines

---

## 🎯 Key Features to Test

✅ Experience-based adaptive forms (Junior/Mid/Senior)  
✅ Detailed narrative responses  
✅ Goals & Organizational Alignment section  
✅ Self-rating with justification  
✅ Manager detailed ratings per criteria  
✅ AI-powered rating suggestions  
✅ Admin-only manager access  
✅ Appraisal history and feedback viewing  

---

## 🆘 Still Having Issues?

1. **Check the app is running**: `http://localhost:3000` should load
2. **Check console for errors**: F12 → Console tab
3. **Verify credentials exactly**: No spaces, correct digits
4. **Try different browser**: Chrome, Firefox, Safari
5. **Check TESTING-GUIDE.md**: Detailed troubleshooting steps

---

**Need Help?** See TESTING-GUIDE.md for detailed solutions!
