const express   = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express()
let forumData = [
  {
    "id": "1",
    "title": "Vulture, oriental white-backed",
    "desc": "Mauv",
    "userId" : "1"
  },
  {
    "id": "2",
    "title": "Capuchin, brown",
    "desc": "Puce",
    "userId" : "1"
  },
  {
    "id": "3",
    "title": "Slender loris",
    "desc": "Mauv",
    "userId" : "2"
  }
]
let userData = [
  { id  : "1", name : "Hahsdas"},
  { id  : "2", name : "askjdnkjsa"},
  { id  : "3", name : "Amlksaml"},
]

let schema = buildSchema(`
  type Forum{
    id : ID,
    title : String,
    desc : String,
    user : User
  }
  type User{
    id : ID,
    name : String,
    forums : [Forum]
  }
  type Query {
    forum(id:ID!) : Forum,
    forums : [Forum]
    user(id:ID!) : User,
    users : [User]
  }

  type Mutation {
    addUser (id : ID, name : String): User,
    addForum (id : ID, title : String,desc: String, userId : String): Forum,
  }
`);

let resolvers = {
  // mereturn data // mefetch atau meresolve
  forums : () => {
    let _user = '';
    // loop forum dan masukkan data user 
    forumData.map(
      eachForum => {
        _user = userData.find(el => el.id === eachForum.userId)
        eachForum['user'] = _user;
      }
    )
    return forumData
  },
  forum : (args) => {
    let _forum = forumData.find(el => el.id === args.id)
    _forum['user'] = userData.find(el => el.id === _forum.id)
    return _forum;
  },
  users : () => {
    let _forums = '';
    
    userData.map(
      eachUser => {
        _forums = forumData.filter(el => el.userId === eachUser.id);
        eachUser['forums'] = _forums
      }
    );
    return userData;
  },
  user : (args) => {
    let _user = userData.find(el => el.id === args.id)
    _user['forums'] = forumData.filter(el => el.userId === _user.id)
    return _user;
  },
  addUser : ({id,name}) => {
    let _newUser = { id ,name }
    userData.push(_newUser);
    return _newUser;
  },
  addForum : ({id,title,desc,userId}) => {
    let _newForum = { id ,title,desc,userId }
    forumData.push(_newForum);
    console.log(forumData)
    return _newForum;
  },
};

app.use('/graphql', graphqlHTTP({
  schema  : schema,
  rootValue : resolvers,
  graphiql : true // GUI yg bisa ditest data2
}));

app.listen(4000, () => console.log('Berhasil terkoneksi !'))