/** Import dotenv to get access to environment variables defines in .env */
require('dotenv').config();

module.exports = {
    db_port: process.env.PORT, // Heroku assigns a dynamic environment "PORT" number for deployed app.
    db_username: process.env.DB_USERNAME,
    db_password: process.env.DB_PASSWORD,
    base_url: `${process.env.PREFIX_URI}${process.env.API_VERSION}`,
    jwt_secret_key: process.env.JWT_SECRET,
    crypto_secret_key: process.env.CRYPTO_SECRET_KEY
}