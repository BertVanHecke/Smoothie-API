import supertest from "supertest";
import assert from "assert";
import { app } from "../../app.js";
import mongoose from "mongoose";
import {
  urls,
  testAccounts,
  invalidInputs,
  validInputs,
} from "../utils/index.js";

describe("smoothie", () => {
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  let testId = "";

  const invalidSmoothie = invalidInputs.smoothie;
  const validSmoothie = validInputs.smoothie;
  const invalidSmoothieId = invalidInputs.id;

  const normal = testAccounts.normal;
  const admin = testAccounts.admin;

  const createSmoothieRoute = urls.smoothies.createSmoothie;
  const getSmoothieRoute = urls.smoothies.getSmoothie;
  const getAllSmoothieRoute = urls.smoothies.getSmoothies;
  const updateSmoothieRoute = urls.smoothies.updateSmoothie;
  const deleteSmoothieRoute = urls.smoothies.deleteSmoothie;
  const loginRoute = urls.auth.login;

  describe("POST smoothie route", () => {
    describe("given the user is not logged in", () => {
      it("should return a 401", async () => {
        await supertest(app)
          .post(createSmoothieRoute)
          .send(invalidSmoothie)
          .expect(401);
      });
    });

    describe("given the user is using an invalid token", () => {
      it("should return a 400", async () => {
        await supertest(app)
          .post(createSmoothieRoute)
          .send(invalidSmoothie)
          .set("x-auth-token", "invalid token")
          .expect(400);
      });
    });

    describe("given the user is logged in", () => {
      describe("given the provided input data is not valid", () => {
        it("should return a 400", async () => {
          const response = await supertest(app).post(loginRoute).send(normal);

          await supertest(app)
            .post(createSmoothieRoute)
            .send(invalidSmoothie)
            .set("x-auth-token", response.headers["x-auth-token"])
            .expect(400);
        });
      });

      describe("given the provided input data is valid", () => {
        it("should return a 200", async () => {
          const response = await supertest(app).post(loginRoute).send(normal);

          await supertest(app)
            .post(createSmoothieRoute)
            .send(validSmoothie)
            .set("x-auth-token", response.headers["x-auth-token"])
            .expect(200)
            .then((res) => {
              testId = res.body._id;
            });
        });
      });
    });
  });

  describe("GET smoothie route", () => {
    describe("given the smoothie does not exist", () => {
      it("should return a 404", async () => {
        await supertest(app)
          .get(`${getSmoothieRoute}${invalidSmoothieId}`)
          .expect(404);
      });
    });

    describe("given the smoothie does exist", () => {
      it("should return a 200", async () => {
        await supertest(app).get(`${getSmoothieRoute}${testId}`).expect(200);
      });

      it("should return the smoothie for the given id", async () => {
        await supertest(app)
          .get(`${getSmoothieRoute}${testId}`)
          .set("Accept", "application/json")
          .expect(200)
          .then((response) => {
            assert(response.body._id, testId);
          });
      });
    });
  });

  describe("GET all smoothies route", () => {
    describe("given no smoothies exist", () => {
      const smoothies = [];

      it("should return a 200", async () => {
        await supertest(app).get(getAllSmoothieRoute).expect(200);
      });

      it("should return an empty list", async () => {
        await supertest(app)
          .get(getAllSmoothieRoute)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then(() => {
            assert(smoothies.length == 0);
          });
      });
    });

    describe("given smoothies exist", () => {
      it("should return a 200", async () => {
        await supertest(app).get(getAllSmoothieRoute).expect(200);
      });

      it("should return a list of smoothies", async () => {
        await supertest(app)
          .get(getAllSmoothieRoute)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((response) => {
            assert(response.body.length > 0);
          });
      });
    });
  });

  describe("UPDATE smoothie route", () => {
    describe("given the user is using an invalid token", () => {
      it("should return a 400", async () => {
        await supertest(app)
          .put(`${updateSmoothieRoute}${invalidSmoothieId}`)
          .send(invalidSmoothie)
          .set("x-auth-token", "invalid token")
          .expect(400);
      });
    });

    describe("given the user is not logged in", () => {
      it("should return a 401", async () => {
        await supertest(app)
          .put(`${updateSmoothieRoute}${invalidSmoothieId}`)
          .send(invalidSmoothie)
          .expect(401);
      });
    });

    describe("given the user is logged in", () => {
      describe("given the provided input data is not valid", () => {
        it("should return a 400", async () => {
          const response = await supertest(app).post(loginRoute).send(normal);

          await supertest(app)
            .put(`${updateSmoothieRoute}${invalidSmoothieId}`)
            .send(invalidSmoothie)
            .set("x-auth-token", response.headers["x-auth-token"])
            .expect(400);
        });
      });

      describe("given the provided input data is valid", () => {
        describe("given the smoothie does not exist", () => {
          it("should return a 404", async () => {
            const response = await supertest(app).post(loginRoute).send(normal);

            await supertest(app)
              .put(`${updateSmoothieRoute}${invalidSmoothieId}`)
              .send(validSmoothie)
              .set("x-auth-token", response.headers["x-auth-token"])
              .expect(404);
          });
        });

        describe("given the smoothie does exist", () => {
          it("should return a 200", async () => {
            const response = await supertest(app).post(loginRoute).send(normal);

            await supertest(app)
              .put(`${updateSmoothieRoute}${testId}`)
              .send(validSmoothie)
              .set("x-auth-token", response.headers["x-auth-token"])
              .expect(200);
          });
        });
      });
    });
  });

  describe("DELETE smoothie route", () => {
    const deleteRoute = `/api/smoothies/delete-smoothie/`;

    describe("given the user is using an invalid token", () => {
      it("should return a 400", async () => {
        await supertest(app)
          .delete(`${deleteSmoothieRoute}${invalidSmoothieId}`)
          .set("x-auth-token", "invalid token")
          .expect(400);
      });
    });

    describe("given the user is not logged in", () => {
      it("should return a 401", async () => {
        await supertest(app)
          .delete(`${deleteSmoothieRoute}${invalidSmoothieId}`)
          .expect(401);
      });
    });

    describe("given the user is logged in", () => {
      describe("given the user is not an administrator", () => {
        it("should return a 403", async () => {
          const response = await supertest(app).post(loginRoute).send(normal);

          await supertest(app)
            .delete(`${deleteSmoothieRoute}${invalidSmoothieId}`)
            .set("x-auth-token", response.headers["x-auth-token"])
            .expect(403);
        });
      });

      describe("given the user is an administrator", () => {
        describe("given the smoothie does not exist", () => {
          it("should return a 404", async () => {
            const response = await supertest(app).post(loginRoute).send(admin);

            await supertest(app)
              .delete(`${deleteSmoothieRoute}${invalidSmoothieId}`)
              .set("x-auth-token", response.headers["x-auth-token"])
              .expect(404);
          });
        });

        describe("given the smoothie does exist", () => {
          it("should return the smoothie for the given id", async () => {
            const response = await supertest(app).post(loginRoute).send(admin);

            await supertest(app)
              .delete(`${deleteSmoothieRoute}${testId}`)
              .set("Accept", "application/json")
              .set("x-auth-token", response.headers["x-auth-token"])
              .expect(200)
              .then((response) => {
                assert(response.body._id, testId);
              });
          });
        });
      });
    });
  });
});
