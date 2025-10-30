describe('Auth - Login', () => {
  beforeEach(() => {
    cy.visit('/auth/login')
  })

  it('credenciales validas redirigen a /', () => {
    cy.get('[data-cy="login-email"]').type('test@email.com')
    cy.get('[data-cy="login-password"]').type('test1234')
    cy.get('[data-cy="login-submit"]').click()
    cy.url().should('eq', `${Cypress.config().baseUrl}/`)
  })

  it('credenciales incorrectas muestran error y no redirige', () => {
    cy.get('[data-cy="login-email"]').type('wrong@mail.com')
    cy.get('[data-cy="login-password"]').type('badpass')
    cy.get('[data-cy="login-submit"]').click()

    cy.get('[data-cy="login-error"]')
      .should('be.visible')
      .and('contain', 'Email o contraseña incorrectos')

    cy.url().should('include', '/auth/login')
  })

  it('error se limpia al escribir nuevamente', () => {
    cy.get('[data-cy="login-email"]').type('error@mail.com')
    cy.get('[data-cy="login-password"]').type('errorpass')
    cy.get('[data-cy="login-submit"]').click()

    cy.get('[data-cy="login-error"]').should('be.visible')
    cy.get('[data-cy="login-password"]').type('x')
    cy.get('[data-cy="login-error"]').should('contain', '\u00A0')
  })

  it('click en "¿Olvidaste tu contraseña?" redirige a /auth/recover', () => {
    cy.get('[data-cy="login-recover-link"]').click()
    cy.location('pathname').should('include', '/auth/recover')
  })

  it('click en "Crear cuenta" redirige a /auth/register', () => {
    cy.get('[data-cy="login-register-link"]').click()
    cy.location('pathname').should('include', '/auth/register')
  })
})