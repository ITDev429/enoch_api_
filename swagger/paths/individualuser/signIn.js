module.exports = {
  post: {
    tags: ["IndividualUsers"],
    summary: "Sign In-Individual User",

    description: "Sign In Individual Users",
    parameters: [],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/SignIn",
          },
        },
      },
    },
    responses: {
      200: {
        description: "Individual User register/created successfully",
      },
      500: {
        description: "Server error/ Something Went Wrong",
      },
      400: {
        description: "Malformed parameters or other bad request.",
      },
      401: {
        description: "Unauthorized",
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
  },
};
