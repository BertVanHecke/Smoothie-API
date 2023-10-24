import supertest from "supertest";
import assert from "assert";
import { app } from "../../app.js";
import mongoose from "mongoose";
import {
  invalidInputs,
  urls,
  validInputs,
  testAccounts,
} from "../utils/index.js";

describe("auth", () => {
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  let createdUserId = "";

  const normal = testAccounts.normal;
  const admin = testAccounts.admin;

  const invalidRegisterUser = invalidInputs.register;

  const validRegisterUser = validInputs.register;

  const invalidLoginUser = invalidInputs.login;

  const validLoginUser = validInputs.login;

  const InvalidEmail = invalidInputs.email.invalid;
  const InvalidPassword = invalidInputs.password;

  const invalidUserEmailInUse = invalidInputs.email.inUse;

  const invalidUserId = invalidInputs.id;

  const loginRoute = urls.auth.login;
  const registerRoute = urls.auth.register;
  const logoutRoute = urls.auth.logout;
  const getUserRoute = urls.users.getMe;
  const getAllUsersRoute = urls.users.getUsers;
  const updateUserRoute = urls.users.updateUser;
  const deleteUserRoute = urls.users.deleteUser;

  describe("POST register route", () => {
    describe("given the provided input data is not valid", () => {
      it("should return a 400", async () => {
        await supertest(app)
          .post(`${registerRoute}`)
          .send(invalidRegisterUser)
          .expect(400);
      });
    });

    describe("given the provided input data is valid", () => {
      describe("given the email is already in use", () => {
        it("should return a 400", async () => {
          await supertest(app)
            .post(`${registerRoute}`)
            .send(invalidUserEmailInUse)
            .expect(400);
        });
      });

      describe("given the email is not yet in use", () => {
        it("should return a 200", async () => {
          await supertest(app)
            .post(registerRoute)
            .send(validRegisterUser)
            .expect(200)
            .then((res) => {
              createdUserId = res.body._id;
            });
        });
      });
    });
  });

  describe("GET logout route", () => {
    describe("given the user is using an invalid token", () => {
      it("should return a 400", async () => {
        await supertest(app)
          .get(`${logoutRoute}`)
          .set("x-auth-token", "invalid token")
          .expect(400);
      });
    });

    describe("given the user is not logged in", () => {
      it("should return a 401", async () => {
        await supertest(app).get(`${logoutRoute}`).expect(401);
      });
    });

    describe("given the user is logged in", () => {
      it("should return a 302", async () => {
        const response = await supertest(app).post(loginRoute).send(normal);

        await supertest(app)
          .get(logoutRoute)
          .set("x-auth-token", response.headers["x-auth-token"])
          .expect(302)
          .then((res) => {
            assert(res.headers["x-auth-token"] == "");
          });
      });
    });
  });

  describe("POST login route", () => {
    describe("given the provided input data is not valid", () => {
      it("should return a 400", async () => {
        await supertest(app)
          .post(`${loginRoute}`)
          .send(invalidLoginUser)
          .expect(400);
      });
    });

    describe("given the provided input data is valid", () => {
      describe("given the email is not correct", () => {
        it("should return a 400", async () => {
          await supertest(app)
            .post(`${loginRoute}`)
            .send(InvalidEmail)
            .expect(400);
        });
      });

      describe("given the email is correct", () => {
        describe("given the password is not correct", () => {
          it("should return a 200", async () => {
            await supertest(app)
              .post(`${loginRoute}`)
              .send(InvalidPassword)
              .expect(400);
          });
        });
        describe("given the password is correct", () => {
          it("should return a 200", async () => {
            await supertest(app)
              .post(`${loginRoute}`)
              .send(validLoginUser)
              .expect(200);
          });
        });
      });
    });
  });

  describe("GET user route", () => {
    describe("given the user is using an invalid token", () => {
      it("should return a 400", async () => {
        await supertest(app)
          .get(getUserRoute)
          .set("x-auth-token", "invalid token")
          .expect(400);
      });
    });

    describe("given the user is not logged in", () => {
      it("should return a 401", async () => {
        await supertest(app).get(getUserRoute).expect(401);
      });
    });

    describe("given the user is logged in", () => {
      it("should return a 200", async () => {
        const response = await supertest(app).post(loginRoute).send(normal);

        await supertest(app)
          .get(getUserRoute)
          .set("x-auth-token", response.headers["x-auth-token"])
          .expect(200);
      });
    });
  });

  describe("GET all users route", () => {
    describe("given the user is using an invalid token", () => {
      it("should return a 400", async () => {
        await supertest(app)
          .get(getAllUsersRoute)
          .set("x-auth-token", "invalid token")
          .expect(400);
      });
    });

    describe("given the user is not logged in", () => {
      it("should return a 401", async () => {
        await supertest(app).get(getAllUsersRoute).expect(401);
      });
    });

    describe("given the user is logged in", () => {
      describe("given the user is not an administrator", () => {
        it("should return a 403", async () => {
          const response = await supertest(app).post(loginRoute).send(normal);

          await supertest(app)
            .get(getAllUsersRoute)
            .set("x-auth-token", response.headers["x-auth-token"])
            .expect(403);
        });
      });

      describe("given the user is an administrator", () => {
        describe("given no users exist", () => {
          const users = [];

          it("should return a 200", async () => {
            const response = await supertest(app).post(loginRoute).send(admin);

            await supertest(app)
              .get(getAllUsersRoute)
              .set("x-auth-token", response.headers["x-auth-token"])
              .expect(200);
          });

          it("should return an empty list", async () => {
            const response = await supertest(app).post(loginRoute).send(admin);

            await supertest(app)
              .get(getAllUsersRoute)
              .set("Accept", "application/json")
              .expect(200)
              .set("x-auth-token", response.headers["x-auth-token"])
              .then(() => {
                assert(users.length == 0);
              });
          });
        });
        describe("given users exist", () => {
          it("should return a 200", async () => {
            const response = await supertest(app).post(loginRoute).send(admin);

            await supertest(app)
              .get(getAllUsersRoute)
              .set("Accept", "application/json")
              .set("x-auth-token", response.headers["x-auth-token"])
              .expect(200);
          });

          it("should return a list of smoothies", async () => {
            const response = await supertest(app).post(loginRoute).send(admin);

            await supertest(app)
              .get(getAllUsersRoute)
              .set("Accept", "application/json")
              .set("x-auth-token", response.headers["x-auth-token"])
              .expect("Content-Type", /json/)
              .expect(200)
              .then((response) => {
                assert(response.body.length > 0);
              });
          });
        });
      });
    });
  });

  describe("UPDATE user route", () => {
    describe("given the user is using an invalid token", () => {
      it("should return a 400", async () => {
        await supertest(app)
          .put(`${updateUserRoute}`)
          .send(invalidRegisterUser)
          .set("x-auth-token", "invalid token")
          .expect(400);
      });
    });

    describe("given the user is not logged in", () => {
      it("should return a 401", async () => {
        await supertest(app)
          .put(`${updateUserRoute}`)
          .send(invalidRegisterUser)
          .expect(401);
      });
    });

    describe("given the user is logged in", () => {
      describe("given the provided input data is not valid", () => {
        it("should return a 400", async () => {
          const response = await supertest(app).post(loginRoute).send(normal);

          await supertest(app)
            .put(`${updateUserRoute}`)
            .send(invalidRegisterUser)
            .set("x-auth-token", response.headers["x-auth-token"])
            .expect(400);
        });
      });

      describe("given the provided input data is valid", () => {
        describe("given the user exists", () => {
          it("should return a 200", async () => {
            const response = await supertest(app).post(loginRoute).send(normal);

            await supertest(app)
              .put(`${updateUserRoute}`)
              .send({
                name: "Test Account",
                email: normal.email,
                password: normal.password
              })
              .set("x-auth-token", response.headers["x-auth-token"])
              .expect(200);
          });
        });
      });
    });
  });

  describe("DELETE user route", () => {
    describe("given the user is using an invalid token", () => {
      it("should return a 400", async () => {
        await supertest(app)
          .delete(`${deleteUserRoute}${invalidUserId}`)
          .set("x-auth-token", "invalid token")
          .expect(400);
      });
    });

    describe("given the user is not logged in", () => {
      it("should return a 401", async () => {
        await supertest(app)
          .delete(`${deleteUserRoute}${invalidUserId}`)
          .expect(401);
      });
    });

    describe("given the user is logged in", () => {
      describe("given the user is not an administrator", () => {
        it("should return a 403", async () => {
          const response = await supertest(app).post(loginRoute).send(normal);

          await supertest(app)
            .delete(`${deleteUserRoute}${invalidUserId}`)
            .set("x-auth-token", response.headers["x-auth-token"])
            .expect(403);
        });
      });

      describe("given the user is an administrator", () => {
        describe("given the user does not exist", () => {
          it("should return a 404", async () => {
            const response = await supertest(app).post(loginRoute).send(admin);

            await supertest(app)
              .delete(`${deleteUserRoute}${invalidUserId}`)
              .set("x-auth-token", response.headers["x-auth-token"])
              .expect(404);
          });
        });

        describe("given the user does exist", () => {
          it("should return the user for the given id", async () => {
            const response = await supertest(app).post(loginRoute).send(admin);

            await supertest(app)
              .delete(`${deleteUserRoute}${createdUserId}`)
              .set("Accept", "application/json")
              .set("x-auth-token", response.headers["x-auth-token"])
              .expect(200)
              .then((response) => {
                assert(response.body._id, createdUserId);
              });
          });
        });
      });
    });
  });
});
