type Entity = import("aframe").Entity;

interface FunctionalComponentProps {
  cb: (ref: Entity) => void;
}
