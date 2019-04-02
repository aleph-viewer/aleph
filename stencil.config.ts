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
  // bundles: [
  //   { components: ['uv-aleph'] },
  //   { components: ['al-control-panel'] },
  //   { components: ['al-node-list'] },
  //   { components: ['al-node-editor'] },
  //   { components: ['al-url-picker'] },
  //   { components: ['al-console'] },
  //   { components: ['al-tabs'] }
  // ],
  copy: [
  ],
  globalStyle: 'src/global/theme.css'
};
