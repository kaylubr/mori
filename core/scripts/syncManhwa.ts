import { importManhwaFromMangaUpdates } from "../src/modules/manhwa/syncService.js"

const result = await importManhwaFromMangaUpdates()

console.log(`Imported ${result.imported} manhwas from MangaUpdates`)