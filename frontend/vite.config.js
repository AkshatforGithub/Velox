// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'


// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(),
//     tailwindcss(),
    
//   ],
//   server: {
//     port: 5173,
//     strictPort: true, // Prevents Vite from switching to another port
//   }
// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: {
        content: ["./src/**/*.{js,jsx,ts,tsx}"],
        darkMode: "class",
        theme: {
          extend: {
            boxShadow: {
              input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
            },
          },
        },
        plugins: [
          // Color variables generator for Tailwind v4
          ({ addBase, theme }) => {
            const colors = theme('colors');
            const cssVariables = {};
            
            // Recursive function to flatten the color object
            const flattenColors = (obj, prefix = '') => {
              Object.entries(obj).forEach(([key, value]) => {
                const newKey = prefix ? `${prefix}-${key}` : key;
                
                if (typeof value === 'object' && value !== null) {
                  flattenColors(value, newKey);
                } else {
                  cssVariables[`--${newKey}`] = value;
                }
              });
            };
            
            flattenColors(colors);
            
            addBase({
              ':root': cssVariables,
            });
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    strictPort: true, // Prevents Vite from switching to another port
  }
});