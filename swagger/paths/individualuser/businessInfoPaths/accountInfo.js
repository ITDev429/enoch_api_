module.exports = {
  post: {
    tags: ["IndividualUsers"],
    summary: "Upload Account Info IndividualUser",
    description: "Upload Account Info - IndividualUser",
    parameters: [],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              dateofbirth: {
                type: "string",
                description: "Add dateofbirth",
              },
              country: {
                type: "string",
                description: "Add Country",
              },
              email: {
                type: "string",
                description: "Add Email",
              },
              phone_number: {
                type: "string",
                description: "Add Phone Number",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Personal Info Saved successfully",
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
    security: [
      {
        Authorization: [],
      },
    ],
  },
};
