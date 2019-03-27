/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import '@stencil/core';

import '@stencil/redux';
import {
  DisplayMode,
} from './enums/DisplayMode';
import {
  Orientation,
} from './enums/Orientation';
import {
  AlToolSerial,
} from './interfaces';
import {
  DisplayMode as DisplayMode2,
} from './enums';


export namespace Components {

  interface AlControlPanel {
    'boundingBoxVisible': boolean;
    'displayMode': DisplayMode;
    'optionsEnabled': boolean;
    'optionsVisible': boolean;
    'orientation': Orientation;
    'selectedTool': string | null;
    'slicesIndex': number;
    'slicesWindowCenter': number;
    'slicesWindowWidth': number;
    'stack': any;
    'stackHelper': AMI.StackHelper;
    'tools': AlToolSerial[];
    'toolsEnabled': boolean;
    'toolsVisible': boolean;
    'volumeSteps': number;
    'volumeWindowCenter': number;
    'volumeWindowWidth': number;
  }
  interface AlControlPanelAttributes extends StencilHTMLAttributes {
    'boundingBoxVisible'?: boolean;
    'displayMode'?: DisplayMode;
    'onOnRemoveTool'?: (event: CustomEvent) => void;
    'onOnSetBoundingBoxVisible'?: (event: CustomEvent) => void;
    'onOnSetDisplayMode'?: (event: CustomEvent) => void;
    'onOnSetOptionsEnabled'?: (event: CustomEvent) => void;
    'onOnSetOrientation'?: (event: CustomEvent) => void;
    'onOnSetSlicesIndex'?: (event: CustomEvent) => void;
    'onOnSetSlicesWindowCenter'?: (event: CustomEvent) => void;
    'onOnSetSlicesWindowWidth'?: (event: CustomEvent) => void;
    'onOnSetToolsEnabled'?: (event: CustomEvent) => void;
    'onOnSetVolumeSteps'?: (event: CustomEvent) => void;
    'onOnSetVolumeWindowCenter'?: (event: CustomEvent) => void;
    'onOnSetVolumeWindowWidth'?: (event: CustomEvent) => void;
    'optionsEnabled'?: boolean;
    'optionsVisible'?: boolean;
    'orientation'?: Orientation;
    'selectedTool'?: string | null;
    'slicesIndex'?: number;
    'slicesWindowCenter'?: number;
    'slicesWindowWidth'?: number;
    'stack'?: any;
    'stackHelper'?: AMI.StackHelper;
    'tools'?: AlToolSerial[];
    'toolsEnabled'?: boolean;
    'toolsVisible'?: boolean;
    'volumeSteps'?: number;
    'volumeWindowCenter'?: number;
    'volumeWindowWidth'?: number;
  }

  interface UvAleph {
    'debug': boolean;
    'dracoDecoderPath': string | null;
    'height': string;
    'load': (src: string) => Promise<void>;
    'loadTools': (tools: any) => Promise<void>;
    'selectTool': (toolId: string) => Promise<void>;
    'setDisplayMode': (displayMode: DisplayMode) => Promise<void>;
    'setToolsEnabled': (enabled: boolean) => Promise<void>;
    'spinnerColor': string;
    'width': string;
  }
  interface UvAlephAttributes extends StencilHTMLAttributes {
    'debug'?: boolean;
    'dracoDecoderPath'?: string | null;
    'height'?: string;
    'onOnLoad'?: (event: CustomEvent) => void;
    'onOnSave'?: (event: CustomEvent) => void;
    'onOnSelectedToolChanged'?: (event: CustomEvent) => void;
    'onOnToolsChanged'?: (event: CustomEvent) => void;
    'spinnerColor'?: string;
    'width'?: string;
  }
}

declare global {
  interface StencilElementInterfaces {
    'AlControlPanel': Components.AlControlPanel;
    'UvAleph': Components.UvAleph;
  }

  interface StencilIntrinsicElements {
    'al-control-panel': Components.AlControlPanelAttributes;
    'uv-aleph': Components.UvAlephAttributes;
  }


  interface HTMLAlControlPanelElement extends Components.AlControlPanel, HTMLStencilElement {}
  var HTMLAlControlPanelElement: {
    prototype: HTMLAlControlPanelElement;
    new (): HTMLAlControlPanelElement;
  };

  interface HTMLUvAlephElement extends Components.UvAleph, HTMLStencilElement {}
  var HTMLUvAlephElement: {
    prototype: HTMLUvAlephElement;
    new (): HTMLUvAlephElement;
  };

  interface HTMLElementTagNameMap {
    'al-control-panel': HTMLAlControlPanelElement
    'uv-aleph': HTMLUvAlephElement
  }

  interface ElementTagNameMap {
    'al-control-panel': HTMLAlControlPanelElement;
    'uv-aleph': HTMLUvAlephElement;
  }


  export namespace JSX {
    export interface Element {}
    export interface IntrinsicElements extends StencilIntrinsicElements {
      [tagName: string]: any;
    }
  }
  export interface HTMLAttributes extends StencilHTMLAttributes {}

}
