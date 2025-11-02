describe('Login Page Tests (SPA-friendly)', () => {
  const loginUrl = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

  beforeEach(() => {
    cy.visit(loginUrl, {
      timeout: 120000, // 2 menit
      failOnStatusCode: false,
      onBeforeLoad: (win) => {
        win.fetch = null; // optional, supaya load event nggak nge-hang
      }
    });
  });

  it('T001 - Open screen login', () => {
    cy.url({ timeout: 120000 }).should('include', '/auth/login');
    // cek input username ada sebagai indikator halaman login siap
    cy.get('input[name="username"]', { timeout: 20000 }).should('be.visible');
  });

  it('T002 - Lupa password (SPA-friendly)', () => {
    // klik tombol “Forgot Password?” tanpa nunggu load event
    cy.get('p.orangehrm-login-forgot-header', { timeout: 20000 })
      .should('be.visible')
      .then(($el) => {
        $el[0].click(); // klik paksa trigger SPA
      });

    // cek kalau form reset muncul
    cy.get('input[name="username"]', { timeout: 20000 }).should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('T003 - Login dengan lupa password (SPA-friendly)', () => {
    // klik tombol “Forgot Password?”
    cy.get('p.orangehrm-login-forgot-header', { timeout: 20000 })
      .should('be.visible')
      .then(($el) => {
        $el[0].click();
      });

    // klik tombol submit tanpa input apapun
    cy.get('button[type="submit"]').click();

    // cek muncul toast/error message
    cy.get('.oxd-text--toast-message', { timeout: 20000 }).should('exist');
  });

  it('T004 - Login tanpa input username', () => {
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    cy.get('div.oxd-input-field-error-message', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'Required');
  });

  it('T005 - Login tanpa input password', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('button[type="submit"]').click();

    cy.get('div.oxd-input-field-error-message', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'Required');
  });

  it('T006 - Cek fungsi button hide/show password', () => {
    const passwordField = 'input[name="password"]';

    cy.get(passwordField)
      .type('admin123')
      .should('have.attr', 'type', 'password');

    cy.get('.oxd-icon-button').click(); // klik ikon mata

    cy.get(passwordField)
      .should('have.attr', 'type', 'text');
  });

  it('T007 - Login dengan akun tidak terdaftar', () => {
    cy.get('input[name="username"]').type('randomuser');
    cy.get('input[name="password"]').type('wrongpass123');
    cy.get('button[type="submit"]').click();

    cy.contains(/invalid credentials/i, { timeout: 10000 }).should('be.visible');
  });
});
