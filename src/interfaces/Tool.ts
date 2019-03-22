import { ToolType } from "../enums/ToolType";

export interface Tool {
  id: number;
  type: ToolType;
  position: string;
  color: string;
  selectedColor: string;
  scale: number;
  maxMeshDistance: number;
  targetObject: string;
}
