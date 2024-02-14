import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkCookies } from '../middlewares/check-cookies'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
    app.post('/', { preHandler: checkCookies }, async (request, reply) => {
        const mealSchema = z.object({
            name: z.string(),
            description: z.string(),
            isOnDiet: z.boolean(),
            date: z.coerce.string()
        })

        const { name, description, isOnDiet, date } = mealSchema.parse(request.body)

        await knex('meals').insert({
            id: randomUUID(),
            name,
            description,
            is_on_diet: isOnDiet,
            date,
            user_id: request.user?.id
        })

        return reply.status(201).send()
    })

    app.get('/', { preHandler: checkCookies }, async (request, reply) => {
        const meals = await knex('meals')
            .where({ user_id: request.user?.id })
            .orderBy('date', 'desc')

        return reply.send({ meals })
    })

    app.get('/:mealId', { preHandler: checkCookies }, async (request, reply) => {
        const paramsSchema = z.object({
            mealId: z.string().uuid()
        })

        const { mealId } = paramsSchema.parse(request.params)

        const meal = await knex('meals')
            .where({ id: mealId })

        if (!meal) return reply.status(404).send({ error: 'Meal not found' })

        return reply.send({ meal })
    })

    app.put('/:mealId', { preHandler: checkCookies }, async (request, reply) => {
        const paramsSchema = z.object({
            mealId: z.string().uuid()
        })

        const { mealId } = paramsSchema.parse(request.params)

        const mealSchema = z.object({
            name: z.string(),
            description: z.string(),
            isOnDiet: z.boolean(),
            date: z.coerce.string()
        })

        const { name, description, isOnDiet, date } = mealSchema.parse(request.body)

        const meal = await knex('meals')
            .where({ id: mealId })

        if (!meal) return reply.status(404).send({ error: 'Meal not found' })

        await knex('meals')
            .where({ id: mealId })
            .update({
                name: name,
                description: description,
                is_on_diet: isOnDiet,
                date
            })

        return reply.status(204).send()
    })

    app.delete('/:mealId', { preHandler: checkCookies }, async (request, reply) => {
        const paramsSchema = z.object({
            mealId: z.string().uuid()
        })

        const { mealId } = paramsSchema.parse(request.params)

        const meal = await knex('meals')
            .where({ id: mealId })

        if (!meal) return reply.status(404).send({ error: 'Meal not found' })

        await knex('meals')
            .where({ id: mealId })
            .delete()

        return reply.status(204).send()
    })

    app.get('/metrics', { preHandler: checkCookies }, async (request, reply) => {

    })
}