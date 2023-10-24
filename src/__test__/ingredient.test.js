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

describe("ingredient", () => {
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  let testId = "";

  const invalidIngredient = invalidInputs.ingredient;
  const validIngredient = validInputs.ingredient;
  const invalidIngredientId = invalidInputs.id;

  const normal = testAccounts.normal;
  const admin = testAccounts.admin;

  const createIngredientRoute = urls.ingredients.createIngredient;
  const getIngredientRoute = urls.ingredients.getIngredient;
  const getAllIngredientRoute = urls.ingredients.getIngredients;
  const updateIngredientRoute = urls.ingredients.updateIngredient;
  const deleteIngredientRoute = urls.ingredients.deleteIngredient;
  const loginRoute = urls.auth.login;

  describe("POST ingredient route", () => {
    describe("given the user is not logged in", () => {
      it("should return a 401", async () => {
        await supertest(app)
          .post(createIngredientRoute)
          .send(invalidIngredient)
          .expect(401);
      });
    });

    describe("given the user is using an invalid token", () => {
      it("should return a 400", async () => {
        await supertest(app)
          .post(createIngredientRoute)
          .send(invalidIngredient)
          .set("x-auth-token", "invalid token")
          .expect(400);
      });
    });

    describe("given the user is logged in", () => {
      describe("given the provided input data is not valid", () => {
        it("should return a 400", async () => {
          const response = await supertest(app).post(loginRoute).send(normal);

          await supertest(app)
            .post(createIngredientRoute)
            .send(invalidIngredient)
            .set("x-auth-token", response.headers["x-auth-token"])
            .expect(400);
        });
      });

      describe("given the provided input data is valid", () => {
        it("should return a 200", async () => {
          const response = await supertest(app).post(loginRoute).send(normal);

          await supertest(app)
            .post(createIngredientRoute)
            .send(validIngredient)
            .set("x-auth-token", response.headers["x-auth-token"])
            .expect(200)
            .then((res) => {
              testId = res.body._id;
            });
        });
      });
    });
  });

  describe("GET ingredient route", () => {
    describe("given the ingredient does not exist", () => {
      it("should return a 404", async () => {
        await supertest(app)
          .get(`${getIngredientRoute}${invalidIngredientId}`)
          .expect(404);
      });
    });

    describe("given the ingredient does exist", () => {
      it("should return a 200", async () => {
        await supertest(app).get(`${getIngredientRoute}${testId}`).expect(200);
      });

      it("should return the ingredient for the given id", async () => {
        await supertest(app)
          .get(`${getIngredientRoute}${testId}`)
          .set("Accept", "application/json")
          .expect(200)
          .then((response) => {
            assert(response.body._id, testId);
          });
      });
    });
  });

  describe("GET all ingredients route", () => {
    describe("given no ingredients exist", () => {
      const ingredients = [];

      it("should return a 200", async () => {
        await supertest(app).get(getAllIngredientRoute).expect(200);
      });

      it("should return an empty list", async () => {
        await supertest(app)
          .get(getAllIngredientRoute)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then(() => {
            assert(ingredients.length == 0);
          });
      });
    });

    describe("given ingredients exist", () => {
      it("should return a 200", async () => {
        await supertest(app).get(getAllIngredientRoute).expect(200);
      });

      it("should return a list of ingredients", async () => {
        await supertest(app)
          .get(getAllIngredientRoute)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((response) => {
            assert(response.body.length > 0);
          });
      });
    });
  });

  describe("UPDATE ingredient route", () => {
    describe("given the user is using an invalid token", () => {
      it("should return a 400", async () => {
        await supertest(app)
          .put(`${updateIngredientRoute}${invalidIngredientId}`)
          .send(invalidIngredient)
          .set("x-auth-token", "invalid token")
          .expect(400);
      });
    });

    describe("given the user is not logged in", () => {
      it("should return a 401", async () => {
        await supertest(app)
          .put(`${updateIngredientRoute}${invalidIngredientId}`)
          .send(invalidIngredient)
          .expect(401);
      });
    });

    describe("given the user is logged in", () => {
      describe("given the provided input data is not valid", () => {
        it("should return a 400", async () => {
          const response = await supertest(app).post(loginRoute).send(normal);

          await supertest(app)
            .put(`${updateIngredientRoute}${invalidIngredientId}`)
            .send(invalidIngredient)
            .set("x-auth-token", response.headers["x-auth-token"])
            .expect(400);
        });
      });

      describe("given the provided input data is valid", () => {
        describe("given the ingredient does not exist", () => {
          it("should return a 404", async () => {
            const response = await supertest(app).post(loginRoute).send(normal);

            await supertest(app)
              .put(`${updateIngredientRoute}${invalidIngredientId}`)
              .send(validIngredient)
              .set("x-auth-token", response.headers["x-auth-token"])
              .expect(404);
          });
        });

        describe("given the ingredient does exist", () => {
          it("should return a 200", async () => {
            const response = await supertest(app).post(loginRoute).send(normal);

            await supertest(app)
              .put(`${updateIngredientRoute}${testId}`)
              .send(validIngredient)
              .set("x-auth-token", response.headers["x-auth-token"])
              .expect(200);
          });
        });
      });
    });
  });

  describe("DELETE ingredient route", () => {
    describe("given the user is using an invalid token", () => {
      it("should return a 400", async () => {
        await supertest(app)
          .delete(`${deleteIngredientRoute}${invalidIngredientId}`)
          .set("x-auth-token", "invalid token")
          .expect(400);
      });
    });

    describe("given the user is not logged in", () => {
      it("should return a 401", async () => {
        await supertest(app)
          .delete(`${deleteIngredientRoute}${invalidIngredientId}`)
          .expect(401);
      });
    });

    describe("given the user is logged in", () => {
      describe("given the user is not an administrator", () => {
        it("should return a 403", async () => {
          const response = await supertest(app).post(loginRoute).send(normal);

          await supertest(app)
            .delete(`${deleteIngredientRoute}${invalidIngredientId}`)
            .set("x-auth-token", response.headers["x-auth-token"])
            .expect(403);
        });
      });

      describe("given the user is an administrator", () => {
        describe("given the ingredient does not exist", () => {
          it("should return a 404", async () => {
            const response = await supertest(app).post(loginRoute).send(admin);

            await supertest(app)
              .delete(`${deleteIngredientRoute}${invalidIngredientId}`)
              .set("x-auth-token", response.headers["x-auth-token"])
              .expect(404);
          });
        });

        describe("given the ingredient does exist", () => {
          it("should return the ingredient for the given id", async () => {
            const response = await supertest(app).post(loginRoute).send(admin);

            await supertest(app)
              .delete(`${deleteIngredientRoute}${testId}`)
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
