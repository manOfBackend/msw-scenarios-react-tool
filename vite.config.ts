import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    dts({
      include: ['src'],
      beforeWriteFile: (filePath, content) => {
        return {
          filePath: filePath.replace('@/', ''),
          content: content.replace(/@\//g, './'),
        }
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@emotion/react',
        '@emotion/styled',
        'lucide-react',
        'msw',
        'msw-scenarios',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@emotion/react': 'emotionReact',
          '@emotion/styled': 'emotionStyled',
          'lucide-react': 'lucideReact',
        },
      },
    },
  },
})
