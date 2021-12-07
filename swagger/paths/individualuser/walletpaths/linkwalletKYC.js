module.exports = {
  post: {
    tags: ["IndividualUsers"],
    summary: "Setup Wallet-Individual User",
    description: "Create/Register Wallety Individual User",
    security: [
      {
        Authorization: [],
      },
    ],
    parameters: [
      {
        in: "query",
        name: "walletType",
        required: true,
        schema: {
          type: "string",
          description: "Select Wallet Type",
          enum: [
            "MetaMask",
            "Ledger",
            "Trezor",
            "Torus",
            "Argent",
            "Portis",
            "Formatic",
            "Gnosis_safe",
            "CoinBase_wallet",
          ],
        },
      },
      {
        in: "query",
        name: "wallet_address",
        required: true,
        schema: {
          type: "string",
          description: "Enter Wallet Address",
          example: "s54LoXz69t7",
        },
      },
    ],

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
