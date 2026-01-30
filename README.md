# Web Tools - Appwrite + React

A modern, beautifully themed web application built with React and Appwrite, featuring a complete light/dark mode implementation with smooth animations and custom fonts.

## Ìæ® Features

### Theme System
- **Light & Dark Mode**: Full theme support with smooth transitions
- **Theme Switcher**: Beautiful animated toggle in the top-right corner
- **Persistent Theme**: Your theme choice is saved to localStorage
- **CSS Variables**: Easy customization through CSS custom properties

### Design & UI
- **Custom Fonts**: Inter, Poppins, Fira Code
- **Smooth Animations**: Fade-in, slide-in, scale animations
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Modern Components**: Cards, buttons, tables with hover effects

### Appwrite Integration
- **Auto-connect**: Automatically pings server on app load
- **Project**: web-tools at http://localhost/v1
- **Request Logging**: Beautiful log viewer with status indicators

## Ì∫Ä Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

App runs at `http://localhost:5173`

## Ìæ≠ Theme System

```jsx
import { useTheme } from './context/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Toggle</button>;
}
```

## Ì¥ß Technologies

- React 19
- Vite 6
- Tailwind CSS 4
- Appwrite 21.2.1
- Google Fonts

## Ì≥Å Structure

```
src/
‚îú‚îÄ‚îÄ components/ThemeSwitcher.jsx
‚îú‚îÄ‚îÄ context/ThemeContext.jsx
‚îú‚îÄ‚îÄ lib/appwrite.js
‚îú‚îÄ‚îÄ App.jsx
‚îî‚îÄ‚îÄ App.css
```

## Ìæ® Color Palette

**Light Mode**: White background, gray text, pink accent
**Dark Mode**: Slate background, light text, hot pink accent

## Ì≥ù License

MIT License - Open source
