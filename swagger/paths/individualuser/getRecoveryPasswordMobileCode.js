module.exports = {
  get: {
    tags: ["IndividualUsers"],
    summary: "Send Code Mobile TwoFA-Individual User",
    description: "Send Code Mobile TwoFA Individual User",
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
      {
        in: "path",
        name: "phonenumber",
        schema: {
          type: "string",
        },
        required: true,
        description: "923111111111",
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
