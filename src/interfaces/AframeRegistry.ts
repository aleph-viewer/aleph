import { AframeComponent, AframeShader } from "./interfaces";

/**
 * Component class definition.
 *
 * Components configure appearance, modify behavior, or add functionality to
 * entities. The behavior and appearance of an entity can be changed at runtime
 * by adding, removing, or updating components. Entities do not share instances
 * of components.
 *
 * @member {object} el - Reference to the entity element.
 * @member {string} attrValue - Value of the corresponding HTML attribute.
 * @member {object} data - Component data populated by parsing the
 *         mapped attribute of the component plus applying defaults and mixins.
 */
export class AframeRegistry {
  public static getObject(): AframeComponent | AframeShader {
    return null;
  }
  public static getName(): string {
    return null;
  }
}
