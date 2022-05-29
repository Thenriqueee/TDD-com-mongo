const app = require("../src/app")
const superTest = require("supertest")
const request = superTest(app)

const mailUser = {name: "TH", email:"thiago@gmail.com", password:"2323"}
const mailUserLogin = {email:"thiago@gmail.com", password:"2323"}
const aleatoryMail = {email:"emailAleatorio@gmail.com", password:"2323"}
const mailUserWithWrongPassword = {email:"thiago@gmail.com", password:"senhaErrada"}


beforeAll( () => {
    return request.post("/user")
    .send(mailUser)
    .then(res => {})
    .catch(err => {
    console.log(err)
    })
})

afterAll( () => {

    return request.delete(`/user/${mailUser.email}`)
    .then(res => {
    })
    .catch(res => {console.log(res)})
})



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

        
        test("Deve impedir que um usuário se cadastre com os dados vazios", () => {

            let user = {name:"", email:"", password:""}

            return request.post("/user").send(user).then(res => {

                expect(res.statusCode).toEqual(400)

            }).catch(err => {
                fail(err)
            })
        })

        test("Deve impedir que um usuário se cadastre com o email repetido", () => {

            let user = {name: "fulano", email:mailUser.email, password:"2323"}

                return request.post("/user").send(user).then(res => {
                   
                    expect(res.body.error).toEqual("Email já cadastrado!")
                    expect(res.statusCode).toEqual(400)
                }).catch(err => {
                    console.log(err)
                    fail(err)    
                })
        })
})

describe("Autenticação", () => {

    test("Deve retornar o token jwt", () => {
        return request.post("/auth").send(mailUserLogin)
        .then(res => {
            expect(res.statusCode).toEqual(200)
            expect(res.body.token).toBeDefined()
        })
        .catch(err => {
            console.log(err)
            fail(err)
        })
    })

    test("Deve impedir que um usuário não cadastrado se logue", () => {
        return request.post("/auth").send(aleatoryMail)
        .then(res => {
            expect(res.statusCode).toEqual(403)
            expect(res.body.errors.email).toEqual("E-mail não cadastrado")
        })
        .catch(err => {
            console.log(err)
            fail(err)
        })
    })

    test("Deve impedir que um usuário com a senha errada não se logue", () => {
        return request.post("/auth").send(mailUserWithWrongPassword)
        .then(res => {
            expect(res.statusCode).toEqual(403)
            expect(res.body.errors.pass).toEqual("Senha incorreta")
        })
        .catch(err => {
            console.log(err)
            fail(err)
        })
    })
})





