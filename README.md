# Employee Appraisal System

A comprehensive narrative-based employee appraisal management system built with Next.js 14, featuring experience-level adaptive forms and detailed manager reviews.

## 🚀 Features

### 🔐 **Authentication & User Management**
- Simple phone number and PIN-based authentication
- Role-based access control (Employee/Manager)
- Experience level classification (Junior/Mid-level/Senior)
- Years of experience tracking (0-10+ years)

### 📝 **Experience-Based Appraisal System**
- **Dynamic Forms**: Different criteria based on experience level
- **Narrative Responses**: Employees write detailed responses for each criteria
- **Manager Reviews**: Managers rate individual responses and provide comprehensive feedback
- **Complete History**: Both employees and managers can view all past appraisals
- **Review History**: Managers have dedicated section for completed reviews
- **Progress Tracking**: Visual indicators and expandable history views

### 🎯 **Experience Levels**
- **Junior Developer** (0-2 years): Focus on learning, code quality, task completion
- **Mid-level Developer** (3-6 years): Technical expertise, mentoring, project ownership
- **Senior Developer** (7-10+ years): Leadership, strategy, stakeholder management

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI, Lucide React icons
- **Backend**: Supabase (PostgreSQL)
- **Notifications**: Sonner
- **Styling**: Tailwind CSS with custom design system

## 📋 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/your-username/employee-appraisal-system.git
cd employee-appraisal-system
npm install
```

### 2. Environment Setup
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup
1. Create a new [Supabase](https://supabase.com) project
2. Run the SQL commands from `supabase-setup.sql` in your Supabase SQL Editor
3. Run the experience update from `supabase-experience-update.sql`

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

### Core Tables
- **`profiles`**: User authentication and experience data
- **`appraisals`**: Appraisal submissions with detailed responses
- **`appraisal_criteria`**: Experience-level specific evaluation criteria

### Key Features
- JSONB storage for detailed responses and ratings
- Experience level classification
- Row Level Security (RLS) policies
- Optimized indexes for performance

## 🎯 Usage Guide

### For Employees
1. **Sign Up**: Register with experience level (0-10+ years)
2. **Complete Appraisals**: Write detailed responses for experience-appropriate criteria
3. **Track Progress**: View submission history and manager feedback
4. **Review Ratings**: See detailed ratings for each criteria

### For Managers
1. **Review Submissions**: Read employee's detailed responses
2. **Rate Responses**: Provide 1-5 ratings for each criteria
3. **Give Feedback**: Write comprehensive overall feedback
4. **Track Team**: Monitor all team member appraisals

## 🏗 Project Structure

```
employee-appraisal-system/
├── app/                          # Next.js App Router
│   ├── dashboard/
│   │   ├── employee/            # Employee dashboard
│   │   └── manager/             # Manager dashboard
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Authentication page
├── components/
│   ├── ui/                      # Shadcn UI components
│   └── ExperienceBasedAppraisalForm.tsx
├── contexts/
│   ├── AuthContext.tsx          # Full Supabase auth
│   └── SimpleAuthContext.tsx    # Demo mode auth
├── lib/
│   ├── supabase.ts             # Supabase client & types
│   └── utils.ts                # Utility functions
├── supabase-setup.sql          # Initial database setup
├── supabase-experience-update.sql # Experience features
└── EXPERIENCE-BASED-FEATURES.md   # Detailed feature docs
```

## 🔧 Configuration

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Demo Mode
The application includes comprehensive demo users for all experience levels:

**Junior Developers:**
- Alex Junior: `1111111111` / `1111` (1 year experience)
- Sam Beginner: `2222222222` / `2222` (2 years experience)

**Mid-level Developers:**
- Taylor Mid-Level: `3333333333` / `3333` (4 years experience)  
- Jordan Experienced: `4444444444` / `4444` (6 years experience)

**Senior Developers:**
- Morgan Senior: `5555555555` / `5555` (8 years experience)
- Casey Expert: `6666666666` / `6666` (10+ years experience)

**Admin/Manager Access:**
- Visit `/admin` or click "Admin/Manager Login"
- Username: `admin`
- Password: `Admin@2024`

**Security**: Only administrators can access the manager dashboard. Employees cannot sign up as managers.

See `DEMO-CREDENTIALS.md` for complete testing guide.

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Other Platforms
- Netlify
- Railway
- Docker deployment ready

## 🔒 Security Features

- Row Level Security (RLS) policies
- Input validation and sanitization
- Protected routes with middleware
- Secure authentication flow
- Environment variable protection

## 📈 Performance

- Optimized database queries
- Efficient JSONB storage
- Lazy loading components
- Responsive design
- Fast page transitions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🔧 Troubleshooting

### Login Issues

If you're having trouble logging in with demo credentials:

1. **Clear Browser Storage**: 
   - Open DevTools (F12) → Application/Storage tab
   - Clear all localStorage data
   - Refresh the page

2. **Hard Refresh**: 
   - Windows/Linux: `Ctrl+Shift+R`
   - Mac: `Cmd+Shift+R`

3. **Try Incognito/Private Mode**: 
   - Open a new incognito/private window
   - Navigate to `http://localhost:3000`
   - Try logging in again

4. **Verify Credentials**: 
   - Ensure no spaces or dashes in phone numbers
   - PINs are exactly 4 digits
   - Copy-paste from DEMO-CREDENTIALS.md if needed

### Quick Test Credentials
- **Junior**: `1111111111` / `1111`
- **Mid-level**: `3333333333` / `3333`
- **Senior**: `5555555555` / `5555`
- **Admin**: `admin` / `Admin@2024` (at `/admin`)

## 📚 Documentation

- �  [Quick Reference](./QUICK-REFERENCE.md) - Copy-paste credentials and quick fixes
- 🧪 [Testing Guide](./TESTING-GUIDE.md) - Comprehensive testing scenarios
- �  [Demo Credentials](./DEMO-CREDENTIALS.md) - All test accounts and workflows
- 🤖 [AI Rating System](./AI-RATING-SYSTEM.md) - AI suggestion feature details
- 📊 [Experience Features](./EXPERIENCE-BASED-FEATURES.md) - Experience-level documentation
- 🚀 [Deployment Guide](./DEPLOYMENT.md) - Production deployment instructions
- 🤝 [Contributing](./CONTRIBUTING.md) - Contribution guidelines

## 🆘 Support

- 🐛 [Issues](https://github.com/your-username/employee-appraisal-system/issues)
- 💬 [Discussions](https://github.com/your-username/employee-appraisal-system/discussions)

---

**Built with ❤️ using Next.js 14 and Supabase**