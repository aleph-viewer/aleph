import { Config } from '@stencil/core';

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
  copy: [{
    src: "**/*.i18n.*.json",
    dest: "i18n"
  }],
  globalStyle: 'src/global/theme.css'
};
