import lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

const adapter = new FileSync('db.json')
const db = lowdb(adapter)

db.defaults({
  nubankTokens: [],
  favoriteOperations: [
    { id: 1, name: '01030433143' },
    { id: 2, name: '00429229178' },
    { id: 3, name: '333333333' },
    { id: 4, name: '4444444444' },
  ],
})
  .write()

export default db
