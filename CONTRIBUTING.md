# Contributing to Employee Appraisal System

Thank you for your interest in contributing to the Employee Appraisal System! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- Supabase account (for database features)

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/employee-appraisal-system.git`
3. Install dependencies: `npm install`
4. Copy environment file: `cp .env.local.example .env.local`
5. Set up Supabase (optional for demo mode)
6. Start development server: `npm run dev`

## 📋 How to Contribute

### Reporting Issues
- Use the GitHub issue tracker
- Provide clear description and steps to reproduce
- Include screenshots for UI issues
- Specify your environment (OS, browser, Node version)

### Suggesting Features
- Open an issue with the "enhancement" label
- Describe the feature and its benefits
- Consider implementation complexity
- Discuss with maintainers before starting work

### Code Contributions

#### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

#### Commit Messages
Follow conventional commits:
- `feat: add experience level filtering`
- `fix: resolve authentication redirect issue`
- `docs: update setup instructions`
- `style: improve mobile responsiveness`

#### Pull Request Process
1. Create a feature branch from `main`
2. Make your changes with clear, focused commits
3. Add tests if applicable
4. Update documentation as needed
5. Ensure all checks pass
6. Submit pull request with clear description

## 🏗 Project Structure

```
├── app/                    # Next.js App Router pages
├── components/            # Reusable UI components
├── contexts/             # React contexts
├── lib/                  # Utilities and configurations
├── public/               # Static assets
└── styles/               # Global styles
```

## 🎨 Code Style

### TypeScript
- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type when possible

### React Components
- Use functional components with hooks
- Follow React best practices
- Implement proper error boundaries

### Styling
- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Maintain consistent spacing and colors

### Database
- Use Supabase client for all database operations
- Implement proper error handling
- Follow RLS (Row Level Security) patterns

## 🧪 Testing

### Running Tests
```bash
npm run test        # Run all tests
npm run test:watch  # Run tests in watch mode
npm run test:e2e    # Run end-to-end tests
```

### Writing Tests
- Write unit tests for utilities and hooks
- Add integration tests for complex features
- Include accessibility tests
- Test error scenarios

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for complex functions
- Document component props with TypeScript
- Include usage examples in README

### User Documentation
- Update README for new features
- Add setup instructions for new dependencies
- Include screenshots for UI changes

## 🔒 Security

### Guidelines
- Never commit sensitive data (API keys, passwords)
- Validate all user inputs
- Follow OWASP security practices
- Report security issues privately

### Authentication
- Use Supabase authentication patterns
- Implement proper session management
- Add rate limiting where appropriate

## 🚀 Deployment

### Environment Variables
- Document all required environment variables
- Provide example values in `.env.local.example`
- Never commit actual credentials

### Database Migrations
- Include SQL migration files
- Document schema changes
- Test migrations on sample data

## 📞 Getting Help

### Communication Channels
- GitHub Issues - Bug reports and feature requests
- GitHub Discussions - General questions and ideas
- Pull Request Reviews - Code-specific discussions

### Response Times
- Issues: 1-3 business days
- Pull Requests: 2-5 business days
- Security Issues: Within 24 hours

## 🏆 Recognition

Contributors will be:
- Listed in the project README
- Mentioned in release notes
- Invited to join the maintainers team (for significant contributions)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Employee Appraisal System! 🎉