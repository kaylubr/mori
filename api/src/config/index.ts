import "dotenv/config"

const PORT = process.env.PORT
const DATABASE_URL = process.env.DEV_DATABASE_URL

export default { PORT, DATABASE_URL }
