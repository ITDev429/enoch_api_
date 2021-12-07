module.exports = {
  components: {
    schemas: {
      User: {
        type: "object",
        required: ["firstName", "lastName", "email", "password"],
        properties: {
          firstName: {
            type: "string",
            description: "User FirstName",
            example: "Malik",
          },
          lastName: {
            type: "string",
            description: "User LastName",
            example: "Malik",
          },
          email: {
            type: "string",
            description: "User's Email",
            example: "mail@gmail.com",
          },
          dateofbirth: {
            type: "string",
            description: "User's date of birth",
            example: "01-01-1999",
          },
          phone_number: {
            type: "string",
            description: "User's Phone Number",
            example: "923111111111",
          },
          password: {
            type: "string",
            description: "User's Password",
            format: "password",
          },
          country: {
            type: "string",
            description: "User's Country",
          },
        },
        xml: {
          name: "User",
        },
      },
      SignIn: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            description: "Enter Email",
            example: "mail@mail.com",
          },
          password: {
            type: "string",
            description: "Enter password",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          message: {
            type: "string",
          },
          internal_code: {
            type: "string",
          },
        },
      },
      linkwallet: {
        type: "object",
        required: ["userId", "WalletType", "wallet_address"],
        properties: {
          userId: {
            type: "string",
            description: "Enter User Id",
            example: "87247464-051e-04a6-b1bf-520a56761858",
          },
          walletType: {
            type: "string",
            description: "Select Wallet Type",
            enum: ["A_1", "B_1", "D_2"],
          },
          wallet_address: {
            type: "string",
            description: "Enter Wallet Address",
            example: "s54LoXz69t7",
          },
        },
      },
    },
    securitySchemes: {
      Authorization: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};
