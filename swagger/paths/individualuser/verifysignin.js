const { password } = require("../../../database");

module.exports = {
  post: {
    tags: ["IndividualUsers"],
    summary: "Verify User Sign In-Individual User",

    description: "Verify User Sign In - IndividualUsers",
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
              password: {
                type: "string",
                description: "Enter Password",
              },
              requestId: {
                type: "string",
                description:
                  "Enter Verification Request Id if veifying with mobile OTP",
                example: "Adaiw232dsd3xerwcwew44",
              },
              code: {
                type: "string",
                description: "Enter Verification Code",
                example: "982749",
              },
              requestId: {
                type: "string",
                description:
                  "Enter Verification Request Id if veifying with mobile OTP",
                example: "Adaiw232dsd3xerwcwew44",
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
