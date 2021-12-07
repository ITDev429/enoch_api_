module.exports = {
  get: {
    tags: ["IndividualUsers"],
    summary: "GET Wallet Sign-Individual User",
    description: "Get sign for Wallet Individual User",
    responses: {
      200: {
        description: "Wallet Sign Success",
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
