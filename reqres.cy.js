describe('Reqres API Automation (Super Simple Version)', () => {

    it('GET Users', () => {
        cy.request('GET', 'https://reqres.in/api/users?page=2')
            .its('status')
            .should('eq', 200)
    })

    it('POST Create User', () => {
        cy.request('POST', 'https://reqres.in/api/users', {
            name: 'Na',
            job: 'QA Intern'
        }).its('status')
            .should('eq', 201)
    })

    it('PUT Update User', () => {
        cy.request('PUT', 'https://reqres.in/api/users/2', {
            name: 'Na Update',
            job: 'QA Fulltime'
        }).its('status')
            .should('eq', 200)
    })

    it('PATCH Update User', () => {
        cy.request('PATCH', 'https://reqres.in/api/users/2', {
            job: 'Senior QA'
        }).its('status')
            .should('eq', 200)
    })

    it('DELETE User', () => {
        cy.request('DELETE', 'https://reqres.in/api/users/2')
            .its('status')
            .should('eq', 204)
    })

    it('Register', () => {
        cy.request('POST', 'https://reqres.in/api/register', {
            email: 'eve.holt@reqres.in',
            password: 'pistol'
        }).its('status')
            .should('eq', 200)
    })

    it('Login', () => {
        cy.request('POST', 'https://reqres.in/api/login', {
            email: 'eve.holt@reqres.in',
            password: 'cityslicka'
        }).its('status')
            .should('eq', 200)
    })

})
