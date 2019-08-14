import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'aleph',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs'
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  globalStyle: 'src/global/theme.css'
};
