import { APIGatewayProxyResult } from "aws-lambda";
import handler from "../src/createTokenHandler";
import { createApiGatewayEvent, createEmptyContext } from "./awsUtils";

describe("When invoking the creteToken handler", () => {
  const emptyContext = createEmptyContext();
  const emptyCallback = () => null;

  describe("with a valid payload", () => {
    let createTokenResult: APIGatewayProxyResult;
    const payload = {
      clientId: process.env.SCOPED_TEST_CLIENT_ID ?? "",
      clientSecret: process.env.SCOPED_TEST_CLIENT_SECRET ?? "",
    };

    beforeEach(async () => {
      const event = createApiGatewayEvent(payload);
      createTokenResult = (await handler(
        event,
        emptyContext,
        emptyCallback
      )) as APIGatewayProxyResult;
    });

    it("should return 201 status code", () => {
      expect(createTokenResult.statusCode).toEqual(201);
    });

    it("should have JWT in the body", () => {
      const jwt = JSON.parse(createTokenResult.body);
      expect(jwt).toHaveProperty("accessToken");
      expect(jwt).toHaveProperty("expiresIn");
      expect(jwt.tokenType).toEqual("Bearer");
    });
  });
});
