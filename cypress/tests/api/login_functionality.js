describe("API tests", () => {
    let valid, invalid;

    before(() => {
        cy.fixture("api_login_data").then((loginData) => {
            valid = loginData.valid;
            invalid = loginData.invalid;
        })
    })

    it("Can login with valid tenant and its credentials", () => {
        valid.forEach(obj => {
            cy.executeLoginCall(obj.tenant, obj.body)
                .then(response => {
                    expect(response.status).to.equal(201);
                    expect(response.body.token).not.null;
                    expect(response.body.tokenType).to.equal("bearer");
                })
        })
    })

    it("Can't login with valid tenant but other credentials", () => {
        cy.executeLoginCall(valid[0].tenant, valid[2].body, false)
            .then(validateBadRequest)
    })

    it("Can't login with invalid tenant", () => {
        invalid.forEach(obj => {
            cy.executeLoginCall(obj.tenant, obj.body, false)
                .then(validateBadRequest)
        })
    })

    it("Can't login with non-existing customerNumber", () => {
        let testObj = structuredClone(valid[1]);
        testObj.body.customerNumber = Date.now();
        cy.executeLoginCall(testObj.tenant, testObj.body, false)
            .then(validateBadRequest)
    })

    it("Can't login with existing customerNumber and wrong password", () => {
        let testObj = structuredClone(valid[0]);
        testObj.body.password = Date.now();
        cy.executeLoginCall(testObj.tenant, testObj.body, false)
            .then(response => {
                expect(response.status).to.equal(400);
                expect(response.body.error).to.equal("Bad Request");
                expect(response.body.message).to.equal("customer-authentication.error.wrong.username.or.password");
            })
    })

    const validateBadRequest = (response) => {
        const expectedStatusCode = 400;
        expect(response.status).to.equal(expectedStatusCode);
        expect(response.body.statusCode).to.equal(expectedStatusCode);
        expect(response.body.error).to.equal("Bad Request");
        expect(response.body.message).to.equal("customer-authentication.error.customer.not-found");
    }
})