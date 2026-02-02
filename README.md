# Web Tools - Appwrite + React

A modern, beautifully themed web application built with React and Appwrite, featuring a complete light/dark mode implementation with smooth animations and custom fonts.

##  Features

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

##  Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

App runs at `http://localhost:5173`

##  Theme System

```jsx
import { useTheme } from './context/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Toggle</button>;
}
```

##  Technologies

- React 19
- Vite 6
- Tailwind CSS 4
- Appwrite 21.2.1
- Google Fonts

##  Structure

```
src/
├── components/ThemeSwitcher.jsx
├── context/ThemeContext.jsx
├── lib/appwrite.js
├── App.jsx
└── App.css
```

##  Color Palette

**Light Mode**: White background, gray text, pink accent
**Dark Mode**: Slate background, light text, hot pink accent

##  License

MIT License - Open source
