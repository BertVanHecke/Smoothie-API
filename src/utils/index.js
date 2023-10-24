import { TEST_ACCOUNT_EMAIL_NORMAL, TEST_ACCOUNT_PASSWORD_NORMAL, TEST_ACCOUNT_EMAIL_ADMIN, TEST_ACCOUNT_PASSWORD_ADMIN } from "../../config/config.js";
export const checkEmail = (x, y) => {
  x != y ? true : false;
};

export const routes = {
  endpoints: {
    ingredients: {
      getIngredients: "/get-all-ingredients",
      getIngredient: "/get-ingredient/:id",
      updateIngredient: "/update-ingredient/:id",
      createIngredient: "/create-ingredient",
      deleteIngredient: "/delete-ingredient/:id",
    },
    smoothies: {
      getSmoothies: "/get-all-smoothies",
      getSmoothie: "/get-smoothie/:id",
      updateSmoothie: "/update-smoothie/:id",
      createSmoothie: "/create-smoothie",
      deleteSmoothie: "/delete-smoothie/:id",
    },
    users: {
      getMe: "/get-me",
      updateUser: "/update-user",
      getUsers: "/get-all-users",
      deleteUser: "/delete-user/:id",
    },
    auth: {
      register: "/register",
      login: "/login",
      logout: "/logout",
    },
  },
  subdirectorys: {
    ingredients: `/api/ingredients`,
    smoothies: `/api/smoothies`,
    users: `/api/users`,
    auth: `/api/auth`,
  },
};

export const urls = {
  ingredients: {
    getIngredients: `${routes.subdirectorys.ingredients}${routes.endpoints.ingredients.getIngredients}`,
    getIngredient:
      `${routes.subdirectorys.ingredients}${routes.endpoints.ingredients.getIngredient}`.slice(
        0,
        -3
      ),
    updateIngredient:
      `${routes.subdirectorys.ingredients}${routes.endpoints.ingredients.updateIngredient}`.slice(
        0,
        -3
      ),
    createIngredient: `${routes.subdirectorys.ingredients}${routes.endpoints.ingredients.createIngredient}`,
    deleteIngredient:
      `${routes.subdirectorys.ingredients}${routes.endpoints.ingredients.deleteIngredient}`.slice(
        0,
        -3
      ),
  },
  smoothies: {
    getSmoothies: `${routes.subdirectorys.smoothies}${routes.endpoints.smoothies.getSmoothies}`,
    getSmoothie:
      `${routes.subdirectorys.smoothies}${routes.endpoints.smoothies.getSmoothie}`.slice(
        0,
        -3
      ),
    updateSmoothie:
      `${routes.subdirectorys.smoothies}${routes.endpoints.smoothies.updateSmoothie}`.slice(
        0,
        -3
      ),
    createSmoothie: `${routes.subdirectorys.smoothies}${routes.endpoints.smoothies.createSmoothie}`,
    deleteSmoothie:
      `${routes.subdirectorys.smoothies}${routes.endpoints.smoothies.deleteSmoothie}`.slice(
        0,
        -3
      ),
  },
  users: {
    getMe: `${routes.subdirectorys.users}${routes.endpoints.users.getMe}`,
    updateUser:
      `${routes.subdirectorys.users}${routes.endpoints.users.updateUser}`,
    getUsers: `${routes.subdirectorys.users}${routes.endpoints.users.getUsers}`,
    deleteUser:
      `${routes.subdirectorys.users}${routes.endpoints.users.deleteUser}`.slice(
        0,
        -3
      ),
  },
  auth: {
    register: `${routes.subdirectorys.auth}${routes.endpoints.auth.register}`,
    login: `${routes.subdirectorys.auth}${routes.endpoints.auth.login}`,
    logout: `${routes.subdirectorys.auth}${routes.endpoints.auth.logout}`,
  },
};

export const invalidInputs = {
  id: "6384ea5f9e88700273892a92",
  register: {
    name: "",
    email: "",
    password: "",
  },
  login: {
    email: "",
    password: "",
  },
  email: {
    invalid: {
      email: "testaccountverkeerd@gmail.com", // verkeerd!
      password: "password",
    },
    inUse: {
      name: "Test Account",
      email: TEST_ACCOUNT_EMAIL_NORMAL,
      password: TEST_ACCOUNT_PASSWORD_NORMAL,
    },
  },
  password: {
    email: "testaccountauth@gmail.com",
    password: "passw", // verkeerd!
  },
  ingredient: {
    name: "a",
  },
  smoothie: {
    name: "",
    ingredients: [
      {
        ingredient: "invalid",
        amount: 202,
        units: "ml",
      },
    ],
    steps: [""],
  },
};

export const validInputs = {
  register: {
    name: "Test Account",
    email: "testaccountauth@gmail.com",
    password: "password",
  },
  login: {
    email: "testaccountauth@gmail.com",
    password: "password",
  },
  ingredient: {
    name: "test-ingredient",
  },
  smoothie: {
    name: "test-smoothie",
    ingredients: [
      {
        ingredient: "63983649aef78c7d5fe034ea",
        amount: 20,
        units: "ml",
      },
    ],
    steps: ["This is a step from the test smoothie"],
  },
};

export const testAccounts = {
  normal: {
    email: TEST_ACCOUNT_EMAIL_NORMAL,
    password: TEST_ACCOUNT_PASSWORD_NORMAL,
  },
  admin: {
    email: TEST_ACCOUNT_EMAIL_ADMIN,
    password: TEST_ACCOUNT_PASSWORD_ADMIN,
  },
};
