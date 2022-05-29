const app = require("../src/app")
const superTest = require("supertest")
const request = superTest(app)



describe("Cadastro de usuário",() => {

    test("Deve cadastrar um usuário corretamente", () => {

        let time = Date.now()
        let email = `${time}@gmail.com`
        let user = {name: "fulano", email, password:"2323"}
        
        return request.post("/user").send(user).then(res => {
            
                expect(res.statusCode).toEqual(200)
                expect(res.body.email).toEqual(email)

            }).catch(err => {
            console.log(err)
            fail(err)
            })
        })


})