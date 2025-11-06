# Contributing to Crop Doctor AI

Thank you for your interest in contributing to Crop Doctor AI! This document provides guidelines for contributing to the project.

## 🌟 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, browser, Node version)

### Suggesting Features

We welcome feature suggestions! Please create an issue with:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed
4. **Test your changes**
   - Ensure the app runs without errors
   - Test in both light and dark modes
   - Test on mobile and desktop
5. **Commit your changes**
   ```bash
   git commit -m "Add: Brief description of your changes"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/YourFeatureName
   ```
7. **Create a Pull Request**
   - Provide a clear description
   - Reference any related issues
   - Include screenshots if UI changes

## 📝 Code Style

### TypeScript/JavaScript
- Use TypeScript for new files
- Follow existing naming conventions
- Use meaningful variable names
- Add JSDoc comments for functions

### React Components
- Use functional components with hooks
- Keep components focused and reusable
- Use proper TypeScript types
- Follow the existing component structure

### CSS/Styling
- Use Tailwind CSS classes
- Follow the agriculture theme (green colors)
- Support both light and dark modes
- Ensure responsive design

## 🧪 Testing

Before submitting a PR:
- Test image upload and analysis
- Test fertilizer recommendations
- Test farm diary functionality
- Test in multiple languages
- Test dark mode
- Test on mobile devices

## 📚 Documentation

- Update README.md if adding features
- Add comments for complex code
- Update API documentation if needed

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn

## 💡 Areas for Contribution

### High Priority
- Add more fertilizers to the database
- Improve AI prompt for better accuracy
- Add more Indian languages
- Optimize image processing
- Add unit tests

### Medium Priority
- Add crop calendar feature
- Implement community forum
- Add expert consultation
- Improve offline support
- Add analytics

### Low Priority
- UI/UX improvements
- Performance optimizations
- Documentation improvements
- Code refactoring

## 🎯 Getting Started

1. **Set up development environment**
   ```bash
   git clone https://github.com/yourusername/crop-doctor-ai.git
   cd crop-doctor-ai
   npm install
   ```

2. **Create .env.local**
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_key
   DATABASE_URL="file:./dev.db"
   ```

3. **Initialize database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📞 Questions?

Feel free to:
- Open an issue for questions
- Join our community discussions
- Reach out to maintainers

Thank you for contributing! 🌾
