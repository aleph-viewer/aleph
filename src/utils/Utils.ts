import { Tool } from "../Tool";

export class Utils {

  static getRandomPosition(): string {
    const cubeDistributionWidth = 20;
    const x: number = Math.random() * cubeDistributionWidth - cubeDistributionWidth / 2;
    const y: number = Math.random() * cubeDistributionWidth - cubeDistributionWidth / 2;
    const z: number = Math.random() * cubeDistributionWidth - cubeDistributionWidth;

    return `${x} ${y} ${z}`;
  }

  static getRandomColor(): string {
    return '#' + ('000000' + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
  }

  static getToolWithHighestId(tools: Tool[]): number {
    if (tools.length) {
      return Math.max.apply(Math, tools.map((tool) => { return tool.id; }))
    }

    return -1;
  }

  static getToolIndex(id: number, tools: Tool[]): number {
    return tools.findIndex((tool: Tool) => {
      return tool.id === id;
    })
  }

  static createTool(tools: Tool[]): Tool {
    return {
      id: Utils.getToolWithHighestId(tools) + 1,
      position: Utils.getRandomPosition(),
      color: '#8cb7ff',
      selectedColor: '#005cf2'
    }
  }
}
