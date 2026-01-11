import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Takealot exact colors
                'takealot': {
                    'blue': '#0b79bf',
                    'blue-dark': '#0a6aa8',
                    'blue-darker': '#085a91',
                    'blue-light': '#e8f4fc',
                    'red': '#e65163',
                    'red-dark': '#d43d4f',
                    'orange': '#f7941d',
                    'green': '#00b67a',
                    'yellow': '#ffc107',
                },
                'brand': {
                    50: '#e8f4fc',
                    100: '#c5e4f7',
                    200: '#9dd2f1',
                    300: '#6ebfe9',
                    400: '#3faee2',
                    500: '#0b79bf',
                    600: '#0a6aa8',
                    700: '#085a91',
                    800: '#064a7a',
                    900: '#043a63',
                },
            },
            boxShadow: {
                'card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
                'card-hover': '0 10px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.05)',
                'header': '0 2px 4px rgba(0,0,0,0.1)',
            },
        },
    },

    plugins: [forms],
};
