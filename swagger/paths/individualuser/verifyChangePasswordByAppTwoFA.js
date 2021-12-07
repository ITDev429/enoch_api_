module.exports = {
  put: {
    tags: ["IndividualUsers"],
    summary: "Verify Change Password-Individual User",

    description: "verify Change Password By APP Two FA - IndividualUser",
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
              token: {
                type: "string",
                description: "Enter Reset Password token",
                example: "761858",
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
