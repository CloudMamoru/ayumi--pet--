import css from 'rollup-plugin-import-css';

export default {
  input: 'src/main.js',
  output: {
    dir: 'build',
    format: 'cjs',
  },
  treeshake: false,
  plugins: [css({ output: 'bundle.css' })],
};
