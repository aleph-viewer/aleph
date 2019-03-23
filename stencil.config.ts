import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'aleph',
  outputTargets:[
    { type: 'dist' },
    { type: 'docs' },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  copy: [
  ],
  globalStyle: 'src/global/variables.css'
};
