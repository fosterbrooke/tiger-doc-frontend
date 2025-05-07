import defaultTheme from 'tailwindcss/defaultTheme';
import tailwindcssFontInter from 'tailwindcss-font-inter';

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            padding: {
                '1/2': '50%',
                full: '100%',
            },
            colors: {
                primary: '#2B4099', // Custom Primary Color
                secondary: '#15357D', // Custom Secondary Color
                dark: '#1D2130',
            },
            fontFamily: {
                inter: ['Inter', ...defaultTheme.fontFamily.sans],
                poppins: ['Poppins', ...defaultTheme.fontFamily.sans],
            }
        },
    },
    plugins: [tailwindcssFontInter],
};
