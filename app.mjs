import express from 'express'
import cors from 'cors'

// class that encapsulates data and provides methods for:
// 1. searching for an object based on an id field
// 2. find an object and push an element to an arrah in that object
class DataAccess {
  constructor(data) {
    this.data = data 
  }

  findById(id) {
    return this.data.reduce((foundObj, curObj) => {
      return id === curObj.id ? curObj : foundObj
    }, null) 
  }

  findOneAndPush(id, fieldName, item) {
    const obj = this.findById(id)
    if(obj !== null) {
      obj[fieldName].push(item)
    } else {
      throw new Error(`object with id ${id} not found`)
    }
    return obj
  }
}

const app = express()

// activate cors middleware to send headers for cross origin resource sharing
app.use(cors())
// parse json bodies
app.use(express.json())

// nyu student club data 
const initClubData = [
  { id: 'winc', name: 'WinC', members: ['Alice'] },
  { id: 'techatnyu', name: 'tech@nyu', members: ['Bob'] },
  { id: 'bugsatnyu', name: 'BUGS@NYU', members: ['Carol', 'Dave'] },
  { id: 'acm', name: 'ACM', members: ['Eve'] },
]

// in-memory "data store"
const clubDao = new DataAccess(initClubData)

app.get('/clubs', (req, res) => {
  res.json(clubDao.data)
})

app.post('/clubs/:id', (req, res) => {
  try {
    const club = clubDao.findOneAndPush(req.params.id, 'members', 
req.body.name)
    res.json({success: true, error: null, club})
  } catch (e) {
    console.log(e)
    res.json({success: false, error: e, club: null})
  }
})

// serve on port 3001 to avoid conflict with create-react-app default port
app.listen(3001)
