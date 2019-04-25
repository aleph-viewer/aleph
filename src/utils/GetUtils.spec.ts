import { GetUtils } from ".";

describe("css units", () => {
  test("should return a default width in pixels", () => {
    const width: string = "640";
    const formatted: string = GetUtils.addCssUnits(width);
    expect(formatted).toBe("640px");
  });

  test("should return the same percentage width", () => {
    const width: string = "100%";
    const formatted: string = GetUtils.addCssUnits(width);
    expect(formatted).toBe("100%");
  });
});

describe("files", () => {
  test("should return the correct file extension", () => {
    const ext: string = GetUtils.getFileExtension("test.gltf");
    expect(ext).toBe("gltf");
  });
});
