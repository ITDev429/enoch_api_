module.exports = {
  put: {
    tags: ["IndividualUsers"],
    summary: "Change Password-Individual User",
    description: "Change Password - IndividualUser",
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
                example: "87247464-051e-04a6-b1bf-520a56761858",
              },
              newPassword: {
                type: "string",
                description: "User's New Password",
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
