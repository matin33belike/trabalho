const { betterAuth } = require("better-auth");
const { prismaAdapter } = require("better-auth/adapters/prisma");
const prismaMain = require("../prisma/mainClient");

const auth = betterAuth({
  database: prismaAdapter(prismaMain, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  secret: process.env.BETTER_AUTH_SECRET,

  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  session: {
    expiresIn: 60 * 60 * 24 * 7, 
    updateAge: 60 * 60 * 24,     
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, 
    },
  },
});

module.exports = auth;
