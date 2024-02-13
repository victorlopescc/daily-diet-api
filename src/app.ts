import fastify from "fastify"
import cookie from "@fastify/cookie"
// TODO: import user routes 
// TODO: import meals routes 

export const app = fastify()
app.register(cookie)

// TODO: register user routes
// TODO: register meals routes