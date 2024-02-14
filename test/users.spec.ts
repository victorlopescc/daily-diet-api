import { app } from '../src/app'
import { execSync } from 'child_process'
import request from 'supertest'
import { describe, beforeAll, afterAll, beforeEach, afterEach, it, expect } from 'vitest'

describe('users routes', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach(() => {
        execSync('npm run knex migrate:latest')
    })

    afterEach(() => {
        execSync('npm run knex migrate:rollback --all')
    })

    it('should be able to create a new user', async () => {
        const response = await request(app.server)
            .post('/users')
            .send({
                name: 'User',
                email: 'user@email.com'
            })
            .expect(201)

        const cookies = response.get('set-cookie')

        expect(cookies).toEqual(
            expect.arrayContaining([
                expect.stringContaining('sessionId')
            ])
        )
    })
})