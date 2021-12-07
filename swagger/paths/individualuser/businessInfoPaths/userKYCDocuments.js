module.exports = {
  post: {
    tags: ["IndividualUsers"],
    summary: "Upload user KYC Documents IndividualUser",
    description: "Upload User KYC Documents - IndividualUser",
    parameters: [],
    requestBody: {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              id1_type: {
                type: "string",
                enum: ["ID card", "Driving Liscence", "Passport"],
                description: "Select Id1 Type",
              },
              id1_number: {
                type: "string",
                description: "Select Id1 Number",
              },
              id1_expiry: {
                type: "string",
                description: "Select Id1 Expiry",
              },
              id1_frontSide: {
                type: "string",
                format: "binary",
                description: "Upload FrontSide Id1",
              },
              id1_backSide: {
                type: "string",
                format: "binary",
                description: "Upload BackSide Id1",
              },

              id2_type: {
                type: "string",
                enum: ["ID card", "Driving Liscence", "Passport"],
                description: "Select Id2 Type",
              },
              id2_number: {
                type: "string",
                description: "Select Id2 Number",
              },
              id2_expiry: {
                type: "string",
                description: "Select Id2 Expiry",
              },
              id2_frontSide: {
                type: "string",
                format: "binary",
                description: "Upload FrontSide Id2",
              },
              id2_backSide: {
                type: "string",
                format: "binary",
                description: "Upload BackSide Id2",
              },
              selfie: {
                type: "string",
                format: "binary",
                description: "Upload Your Selfie",
              },
              addressProof: {
                type: "string",
                format: "binary",
                description: "Upload Your Address Proof",
              },
            },
            required: [
              "id1_type",
              "id1_number",
              "id1_expiry",
              "id1_frontSide",
              "id1_backSide",
              "id2_type",
              "id2_number",
              "id2_expiry",
              "id2_frontSide",
              "id2_backSide",
              "selfie",
              "addressProof",
            ],
          },
        },
      },
    },
    responses: {
      200: {
        description: "User Documents Saved successfully",
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
