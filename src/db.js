import lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

const adapter = new FileSync('db.json')
const db = lowdb(adapter)

db.defaults({
  nubankTokens: [],
  favoriteOperations: [
    { id: 1, username: '01030433143' },
    { id: 2, username: '00429229178' },
  ],
})
  .write()

export default db
