module.exports = {
  post: {
    tags: ["IndividualUsers"],
    summary: "Send Verification Code to Phone Number-Individual User",
    description: "Sign In Individual Users",
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
              phonenumber: {
                type: "string",
                description: "Enter Verification Number",
                example: "923111111111",
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
