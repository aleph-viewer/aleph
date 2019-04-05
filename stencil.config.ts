import { Config } from '@stencil/core';

export const config: Config = {
  nodeResolve: {
    browser: true,
    preferBuiltins: false
  },
  plugins: [],
  namespace: 'aleph',
  outputTargets:[
    { type: 'dist' },
    { type: 'docs' },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  globalStyle: 'src/global/theme.css'
};
