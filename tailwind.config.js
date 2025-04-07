/** @type {import('tailwindcss').Config} */
export const darkMode = 'class';
export const content = [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './pages/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
    './node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}',
];
export const theme = {
    extend: {
        screens: {
            xs: { max: '400px' },
        },
    },
};
export const plugins = [];
