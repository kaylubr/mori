import app from "./app.js"
import config from "./config/index.js"
import logger from "./utils/logger.js"

app.listen(config.PORT, () => {
  logger.info(`Server listening to PORT: ${config.PORT}`)
})
