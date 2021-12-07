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
              address1: {
                type: "string",
                description: "Add Address 1",
              },
              address2: {
                type: "string",
                description: "Add Address 2",
              },
              city: {
                type: "string",
                description: "Add City",
              },
              country: {
                type: "string",
                description: "Add Country",
              },
              postal_code: {
                type: "string",
                description: "Add Postal Code",
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
