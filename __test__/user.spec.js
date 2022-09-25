const request = require('supertest');
const {app, server} = require('../index');

const name = 'name name';
const email = 'judexa24@gmail.com';
const password = '12345@Ju67890';
const country = 'Singapore';
const city = 'Inner city';

describe('Checking Endpoints Of Users', () => {

     afterAll(async () => {
         app.disable();
         server.close();
     })

     it('should signup user', async () => {

        const res = await request(app)
        .post('/v1/api/user/sign-up')
        .send({
            name,
            email,
            password,
            country,
            city,
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toEqual(true);
    });

    it('should login user', async () => {

        const res = await request(app)
        .post('/v1/api/user/sign-in')
        .send({
            email,
            password
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.user.data.email).toEqual(email);
        expect(res.body.user.data.password).not.toEqual(password);
    });

})