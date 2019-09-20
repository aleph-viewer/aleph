import { Config } from '@stencil/core';
import glslify from 'rollup-plugin-glslify';

export const config: Config = {
  namespace: 'aleph',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  copy: [
    {
      src: '**/*.i18n.*.json',
      dest: 'i18n'
    }
    // {
    //   src: '../loader',
    //   dest: 'loader'
    // }
  ],
  testing: {
    testPathIgnorePatterns: ["/node_modules/", "/src/utils/shaders/"]
  },
  plugins: [glslify({ basedir: 'src/assets/shaders' })],
  globalStyle: 'src/global/theme.css'
};
