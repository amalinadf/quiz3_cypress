describe('Login Page Tests (with Intercept)', () => {
    const loginUrl = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

    beforeEach(() => {
        cy.intercept('GET', '**/i18n/messages').as('loadMessages');

        cy.visit(loginUrl, {
            timeout: 120000,
            failOnStatusCode: false,
        });

        cy.wait('@loadMessages'); // bukti bahwa SPA script ke-load
    });

    it('T001 - Open screen login', () => {
        cy.url().should('include', '/auth/login');
        cy.get('input[name="username"]').should('be.visible');
    });

    it('T002 - Lupa password (SPA)', () => {
        cy.intercept('GET', '**/requestPasswordResetCode').as('forgotPage');

        cy.get('p.orangehrm-login-forgot-header').click();

        cy.wait('@forgotPage'); // verify page SPA call
        cy.get('input[name="username"]').should('be.visible');
    });

    it('T003 - Submit lupa password tanpa input', () => {
        cy.intercept('POST', '**/api/v2/auth/requestPasswordResetCode').as('resetReq');

        cy.get('p.orangehrm-login-forgot-header').click();
        cy.get('button[type="submit"]').click();

        cy.wait('@resetReq'); // cek request ke server dikirim
        cy.get('.oxd-text--toast-message').should('exist');
    });

    it('T004 - Login tanpa input username', () => {
        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();

        cy.get('div.oxd-input-field-error-message')
            .should('be.visible')
            .and('contain', 'Required');
    });

    it('T005 - Login tanpa input password', () => {
        cy.get('input[name="username"]').type('Admin');
        cy.get('button[type="submit"]').click();

        cy.get('div.oxd-input-field-error-message')
            .should('be.visible')
            .and('contain', 'Required');
    });

    it('T006 - Cek fungsi hide/show password', () => {
        const passwordField = 'input[name="password"]';

        cy.get(passwordField)
            .type('admin123')
            .should('have.attr', 'type', 'password');

        cy.get('.oxd-icon-button').click();
        cy.get(passwordField).should('have.attr', 'type', 'text');
    });

    it('T007 - Login failed (akun tidak terdaftar)', () => {
        cy.intercept('POST', '**/api/v2/auth/validate', (req) => {
            req.reply({
                statusCode: 401,
                body: { message: 'Invalid credentials' }
            });
        }).as('loginFailed');

        cy.get('input[name="username"]').type('randomuser');
        cy.get('input[name="password"]').type('wrongpass123');
        cy.get('button[type="submit"]').click();

        cy.wait('@loginFailed');
        cy.contains(/invalid credentials/i).should('be.visible');
    });
});
