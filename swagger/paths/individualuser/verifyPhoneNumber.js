module.exports = {
  post: {
    tags: ["IndividualUsers"],
    summary: "Verify Recovery Number-Individual User",
    description: "Verify Recovery PhoneNumber Individual User",
    parameters: [],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            properties: {
              email: {
                type: "string",
                description: "Enter Email",
                example: "mail@gmail.com",
              },
              password: {
                type: "string",
                description: "Enter Password",
              },
              requestId: {
                type: "string",
                description: "Enter Verification Request Id",
                example: "Adaiw232dsd3xerwcwew44",
              },
              code: {
                type: "string",
                description: "Enter Verification Code",
                example: "982749",
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
