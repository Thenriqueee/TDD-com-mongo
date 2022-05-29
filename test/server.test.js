const app = require("../src/app")
const superTest = require("supertest")
const request = superTest(app)


test("Aplicação deve responder na porta 3131", () => {

    return request.get("").then(res => {
            let status = res.statusCode
            expect(status).toEqual(200)
    }).catch(err => {
        fail(err)
    })
})