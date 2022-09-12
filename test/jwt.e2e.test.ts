import axios, { AxiosRequestConfig } from "axios";

import { getToken } from "./authHelper";

describe("When hitting a protected endpoint", () => {
  describe("with a valid, scoped JWT as Bearer token", () => {
    let scopedToken: string;

    beforeAll(async () => {
      const credentials = {
        clientId: process.env.SCOPED_TEST_CLIENT_ID ?? "",
        clientSecret: process.env.SCOPED_TEST_CLIENT_SECRET ?? "",
      };
      ({ accessToken: scopedToken } = await getToken(credentials));
    });

    it("should succeed", async () => {
      // ARRANGE
      const axiosOptions: AxiosRequestConfig = {
        baseURL: process.env.API_URL,
        headers: {
          Authorization: `Bearer ${scopedToken}`,
        },
      };

      // ACT
      const { status } = await axios.get("/hello", axiosOptions);

      // ASSERT
      expect(status).toEqual(200);
    });
  });

  describe("with a valid, scoped JWT as api key (no Bearer)", () => {
    let scopedToken: string;

    beforeAll(async () => {
      const credentials = {
        clientId: process.env.SCOPED_TEST_CLIENT_ID ?? "",
        clientSecret: process.env.SCOPED_TEST_CLIENT_SECRET ?? "",
      };
      ({ accessToken: scopedToken } = await getToken(credentials));
    });

    it("should succeed", async () => {
      // ARRANGE
      const axiosOptions: AxiosRequestConfig = {
        baseURL: process.env.API_URL,
        headers: {
          Authorization: scopedToken,
        },
      };

      // ACT
      const { status } = await axios.get("/hello", axiosOptions);

      // ASSERT
      expect(status).toEqual(200);
    });
  });

  describe("with a bad JWT Bearer token", () => {
    it("should fail with 401 (Unauthorized)", async () => {
      // ARRANGE
      const axiosOptions: AxiosRequestConfig = {
        baseURL: process.env.API_URL,
        headers: {
          Authorization: "Bearer xyz",
        },
        validateStatus: () => true,
      };

      // ACT
      const { status } = await axios.get("/hello", axiosOptions);

      // ASSERT
      expect(status).toEqual(401);
    });
  });
});
