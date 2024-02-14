import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
    app.post('/', async (request, reply) => {
        const userSchema = z.object({
            name: z.string(),
            email: z.string().email(),
        })

        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            sessionId = randomUUID()

            reply.setCookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 1 week
            })
        }

        const { name, email } = userSchema.parse(request.body)

        const emailExists = await knex('users').where({ email }).first()

        if (emailExists) return reply.status(400).send({ error: 'Email already exists' })

        await knex('users').insert({
            id: randomUUID(),
            name,
            email,
            session_id: sessionId,
        })

        return reply.status(201).send()
    })
}