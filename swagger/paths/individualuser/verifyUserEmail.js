module.exports = {
  post: {
    tags: ["IndividualUsers"],
    summary: "Verify User Email-Individual User",
    description: "Verify Individual User Email",
    parameters: [],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            properties: {
              email: {
                type: "string",
              },
              emailverificationtoken: {
                type: "string",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "User Email Verified",
        schema: {
          $ref: "#/definitions/verificationEmail",
        },
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
