module.exports = {
  post: {
    tags: ["IndividualUsers"],
    summary: "Add New Number-Individual User",
    description: "Change Phone Number - IndividualUser",
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
              Number: {
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
