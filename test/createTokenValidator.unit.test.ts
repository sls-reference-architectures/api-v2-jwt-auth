import validate from "../src/createTokenValidator";

describe("When validating a create token body", () => {
  describe("with a valid payload", () => {
    it("should no-op", () => {
      // ARRANGE
      const validPayload = {
        clientId: "x",
        clientSecret: "y",
      };

      // ACT
      const validateAction = () => validate(validPayload);

      // ASSERT
      expect(validateAction).not.toThrow();
    });
  });

  describe("with a missing clientId", () => {
    it("should throw BadRequest (400)", () => {
      // ARRANGE
      const invalidPayload = {
        clientId: "",
        clientSecret: "y",
      };

      // ACT
      const validateAction = () => validate(invalidPayload);

      // ASSERT
      expect(validateAction).toThrow(/Bad Request/);
      expect(validateAction).toThrow(/clientId/);
    });
  });

  describe("with a missing clientSecret", () => {
    it("should throw BadRequest (400)", () => {
      // ARRANGE
      const invalidPayload = {
        clientId: "x",
        clientSecret: "",
      };

      // ACT
      const validateAction = () => validate(invalidPayload);

      // ASSERT
      expect(validateAction).toThrow(/Bad Request/);
      expect(validateAction).toThrow(/clientSecret/);
    });
  });

  describe("with both missing clientId & clientSecret", () => {
    it("should throw BadRequest (400) with both names in msg", () => {
      // ARRANGE
      const invalidPayload = {
        clientId: "",
        clientSecret: "",
      };

      // ACT
      const validateAction = () => validate(invalidPayload);

      // ASSERT
      expect(validateAction).toThrow(/Bad Request/);
      expect(validateAction).toThrow(/clientId/);
      expect(validateAction).toThrow(/clientSecret/);
    });
  });

  describe("with an extra property attached", () => {
    it("should strip it out", () => {
      // ARRANGE
      const payloadWithExtraProp = {
        clientId: "x",
        clientSecret: "y",
        extra: "z",
      };

      // ACT
      const result = validate(payloadWithExtraProp);

      // ASSERT
      expect(result).not.toHaveProperty("extra");
    });
  });
});
