import LoginPage from './loginPage';

describe('Login Page Tests - POM Version', () => {

    beforeEach(() => {
        LoginPage.visit();
    });

    it('T001 - Open screen login', () => {
        cy.url().should('include', '/auth/login');
        LoginPage.elements.usernameInput().should('be.visible');
    });

    it('T002 - Lupa password (SPA-friendly)', () => {
        LoginPage.clickForgotPassword();
        LoginPage.elements.usernameInput().should('be.visible');
        LoginPage.elements.loginBtn().should('be.visible');
    });

    it('T003 - Login dengan lupa password tanpa input', () => {
        LoginPage.clickForgotPassword();
        LoginPage.elements.loginBtn().click();
        LoginPage.elements.toastMessage().should('exist');
    });

    it('T004 - Login tanpa input username', () => {
        LoginPage.login(null, 'admin123');
        LoginPage.elements.errorRequired().should('be.visible').and('contain', 'Required');
    });

    it('T005 - Login tanpa input password', () => {
        LoginPage.login('Admin', null);
        LoginPage.elements.errorRequired().should('be.visible').and('contain', 'Required');
    });

    it('T006 - Cek fungsi button hide/show password', () => {
        LoginPage.elements.passwordInput().type('admin123').should('have.attr', 'type', 'password');
        LoginPage.elements.showPasswordBtn().click();
        LoginPage.elements.passwordInput().should('have.attr', 'type', 'text');
    });

    it('T007 - Login dengan akun tidak terdaftar', () => {
        LoginPage.login('randomuser', 'wrongpass123');
        cy.contains(/invalid credentials/i).should('be.visible');
    });

});
