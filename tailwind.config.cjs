module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors
        white: '#ffffff',
        black: '#000000',
        transparent: 'transparent',

        // Dark & Sleek Palette
        'dark-bg': '#0a0a0a',
        'dark-surface': '#13131a',
        'dark-border': '#2a2a38',

        // Accent colors
        'cyan-accent': '#00d4ff',
        'purple-accent': '#7c3aed',
        'emerald-success': '#10b981',
        'amber-warning': '#f59e0b',

        // Gray tokens used in the app
        'gray-primary': '#ffffff',
        'gray-secondary': '#b0b0b8',
        'gray-tertiary': '#6b6b78',
      },
      keyframes: {
        voiceWave: {
          '0%, 100%': { height: '4px' },
          '50%': { height: '24px' },
        },
        smoothWave: {
          '0%': { transform: 'translateY(0px)', opacity: '0.3' },
          '50%': { transform: 'translateY(-12px)', opacity: '1' },
          '100%': { transform: 'translateY(0px)', opacity: '0.3' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        cyanGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)' },
        },
        ringPulse: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
      },
      animation: {
        voiceWave: 'voiceWave 1s ease-in-out infinite',
        smoothWave: 'smoothWave 1.5s ease-in-out infinite',
        fadeIn: 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        slideInLeft: 'slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        cyanGlow: 'cyanGlow 2s ease-in-out infinite',
        ringPulse: 'ringPulse 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};