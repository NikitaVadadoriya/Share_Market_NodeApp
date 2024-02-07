require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  API_KEY: process.env.API_KEY,
  COMPANY_LOGO_URL: process.env.COMPANY_LOGO_URL
} 