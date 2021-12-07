module.exports = {
  put: {
    tags: ["AdminRoutes"],
    summary: "Update an existing Account Status",
    description: "Change Account Status For Individual User",
    parameters: [
      {
        in: "query",
        name: "userIds",
        schema: {
          required: true,
          type: "array",
          wrapped: true,
          items: {
            type: "string",
            example: "87247464-051e-04a6-b1bf-520a56761858",
          },
        },
      },
      {
        in: "query",
        name: "status",
        schema: {
          required: true,
          type: "string",
          enum: ["disabled", "enabled", "active", "suspended"],
        },
      },
    ],
    requestBody: {},
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
