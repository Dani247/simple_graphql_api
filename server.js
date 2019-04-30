const express = require('express')
const bodyParser = require('body-parser')
const graphHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const fetch = require('node-fetch')

const app = express()
app.use(bodyParser.json())


const schema = buildSchema(`
  type Post{
    userId: Int
    id: Int
    title: String!
    body: String!
  }

  type RootQuery{
    posts: [Post!]!
  }

  type RootMutation{
    addPost(title: String!, body: String!): Post!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);

app.use(
  "/graphql",
  graphHttp({
    graphiql: true,
    schema,
    rootValue: {
      posts: async () => {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        const posts = await res.json();
        return posts;
      },
      addPost: async args => {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
          method: "POST",
          body: JSON.stringify({
            title: args.title,
            body: args.body
          }),
          headers: { "Content-Type": "application/json" }
        });
        const newPost = await res.json();
        return newPost;
      }
    }
  })
);

const port = process.env.PORT || 3001
app.listen(port, () => console.log('Server running...'))