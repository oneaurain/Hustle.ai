/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // SideQuest Brand Colors
        'quest-green': '#00FF87',
        'quest-purple': '#6B48FF',
        'gold-reward': '#FFD700',
        'dark-bg': '#0A0E27',
        'card-bg': '#1A1F3A',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0AEC0',
        'border-color': '#2D3748',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'space-grotesk': ['SpaceGrotesk', 'monospace'],
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(0, 255, 135, 0.3)',
        'glow-purple': '0 0 20px rgba(107, 72, 255, 0.3)',
        'glow-gold': '0 0 20px rgba(255, 215, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
