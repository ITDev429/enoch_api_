module.exports = {
  post: {
    tags: ["IndividualUsers"],
    summary: "Verify change Number Request-Individual User",

    description: "Verify Change Number Request - IndividualUsers",
    parameters: [],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            required: ["email", "password", "code"],
            properties: {
              email: {
                type: "string",
                description: "Enter Email",
                example: "mail@gmail.com",
              },
              token: {
                type: "string",
                description: "Enter Change Number Token",
                example: "123456",
              },
            },
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
