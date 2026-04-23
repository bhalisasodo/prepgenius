/** @type {import('tailwindcss').Config} */
export default {
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
        dark: {
          bg: '#0a0a0a',      // Almost black background
          surface: '#13131a',  // Slightly lighter surface
          border: '#2a2a38',   // Subtle divider
        },
        cyan: {
          accent: '#00d4ff',   // Bright cyan accent
          50: '#ecfdff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#082f49',
        },
        purple: {
          accent: '#7c3aed', // Vibrant purple
          dark: '#6b21a8',
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        emerald: {
          success: '#10b981', // Success green
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#145231',
        },
        amber: {
          warning: '#f59e0b', // Warning amber
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        gray: {
          primary: '#ffffff',      // White text
          secondary: '#b0b0b8',    // Light gray
          tertiary: '#6b6b78',     // Medium gray
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        red: {
          500: '#ef4444',
        },
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
}
