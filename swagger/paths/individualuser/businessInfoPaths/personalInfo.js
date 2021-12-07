module.exports = {
  post: {
    tags: ["IndividualUsers"],
    summary: "Upload Personal Info IndividualUser",
    description: "Upload Personal Info - IndividualUser",
    parameters: [],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              first_name: {
                type: "string",
                description: "Add FirstName",
              },
              last_name: {
                type: "string",
                description: "Add LastName",
              },
              middle_name: {
                type: "string",
                description: "Add MiddleName",
              },
            },
            required: ["first_name", "last_name", "middle_name"],
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
