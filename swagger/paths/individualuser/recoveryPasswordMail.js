module.exports = {
  get: {
    tags: ["IndividualUsers"],
    summary: "GET Recovery Password-Individual User",
    description: "Get Recovery Password Mail - Individual User",
    parameters: [
      {
        in: "path",
        name: "email",
        schema: {
          type: "string",
        },
        required: true,
        description: "Email Address",
      },
    ],
    requestBody: {},
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
