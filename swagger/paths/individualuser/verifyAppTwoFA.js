module.exports = {
  post: {
    tags: ["IndividualUsers"],
    summary: "Get QR for APP Two FA-Individual User",
    description: "Get QR For APP TwoFA Individual User",
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
              secret: {
                type: "string",
                description: "Enter Secret",
                example: "A26Dc73VZI27OPx",
              },
              code: {
                type: "string",
                description:
                  "Enter Verification Code Generated inAuthenticator APP",
                example: "987367",
              },
              qrVerificationtoken: {
                type: "string",
                description: "Enter Recent QR Verification token",
                example: "a06bd241-e55a-4e2e-bb98-2d4126ea689e",
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
