module.exports = {
  put: {
    tags: ["AdminRoutes"],
    summary: "Change Users KYC Status",
    description: "Change Users KYC Status",
    parameters: [
      {
        in: "query",
        name: "userId",
        schema: {
          type: "string",
          pattern: "[a-zA-Z-.0-9]{36}",
        },
        description: "User Id to Change KYC Status",
        example: "b238d8c9-961e-481a-8c32-3b1e31babed1",
        required: true,
      },
      {
        in: "query",
        name: "status",
        schema: {
          type: "string",
          enum: ["approve", "reject"],
        },
        description: "Chage User KYC Status",
        required: true,
      },
    ],
    responses: {
      200: {
        description: "Change Users KYC Status",
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
    security: [
      {
        Authorization: [],
      },
    ],
  },
};
