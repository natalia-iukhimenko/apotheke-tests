Cypress.Commands.add('executeLoginCall', (tenant, jsonBody, failOnStatusCode = true) => {
    cy.request({
        method: 'POST',
        url: `/auth/v1/${tenant}/login`,
        failOnStatusCode: failOnStatusCode,
        body: jsonBody
    })
})