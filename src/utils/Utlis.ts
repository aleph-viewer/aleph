export class Utils {

  static getRandomPosition(): string {
    const cubeDistributionWidth = 100;
    const x: number = Math.random() * cubeDistributionWidth - cubeDistributionWidth / 2;
    const y: number = Math.random() * cubeDistributionWidth - cubeDistributionWidth / 2;
    const z: number = Math.random() * cubeDistributionWidth - cubeDistributionWidth;

    return `${x} ${y} ${z}`;
  }

  static getRandomColor(): string {
    return '#' + ('000000' + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
  }

}
