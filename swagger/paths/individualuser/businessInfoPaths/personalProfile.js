module.exports = {
  post: {
    tags: ["IndividualUsers"],
    summary: "Upload Profile Photo IndividualUser",
    description: "Upload Profile Picture - IndividualUser",
    parameters: [],
    requestBody: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              profile_image: {
                required: true,
                type: "string",
                format: "binary",
                description: "Upload Profile Picture",
              },
            },
            required: ["profile_image"],
          },
        },
      },
    },
    responses: {
      200: {
        description: "Profile Picture Saved successfully",
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
