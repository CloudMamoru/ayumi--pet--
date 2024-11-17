import css from 'rollup-plugin-import-css';

export default {
  input: 'src/main.js',
  output: {
    dir: 'build',
    format: 'cjs',
    sourcemap: true, // Карта исходников для отладки
    entryFileNames: '[name].js',
    chunkFileNames: '[name]-[hash].js', // Имя файлов для чанков
  },
  treeshake: false,
  plugins: [css({ output: 'bundle.css' })],
};
