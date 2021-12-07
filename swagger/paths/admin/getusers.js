module.exports = {
  get: {
    tags: ["AdminRoutes"],
    summary: "GET Users List",
    description: "Get all Users",
    responses: {
      200: {
        description: "User List Success",
      },
      500: {
        description: "Server error/ Something Went Wrong",
      },
      400: {
        description: "Malformed parameters or other bad request.",
      },
      GeneralError: {
        description: "An error occurred",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
    },
    security: [
      {
        Authorization: [],
      },
    ],
  },
};
