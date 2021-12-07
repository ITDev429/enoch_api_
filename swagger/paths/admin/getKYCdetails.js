module.exports = {
  get: {
    tags: ["AdminRoutes"],
    summary: "GET Users KYC Details",
    description: "Get User KYC Details",
    parameters: [
      {
        in: "query",
        name: "userId",
        schema: {
          type: "string",
          pattern: "[a-zA-Z-.0-9]{36}",
        },
        description: "User Id to GET KYC Detailss",
        example: "b238d8c9-961e-481a-8c32-3b1e31babed1",
        required: true,
      },
    ],
    security: [
      {
        Authorization: [],
      },
    ],
    responses: {
      200: {
        description: "User Details Success",
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
