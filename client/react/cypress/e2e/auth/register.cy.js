describe('Auth - Register', () => {
  beforeEach(() => {
    cy.visit('/auth/register')
  })

  it('email inválido muestra error', () => {
    cy.get('[data-cy="register-name"]').type('test')
    cy.get('[data-cy="register-email"]').type('email@invalido')
    cy.get('[data-cy="register-password"]').type('12345678') 
    cy.get('[data-cy="register-password2"]').type('12345678')
    cy.get('[data-cy="register-submit"]').click()

    cy.get('[data-cy="register-error-email"]')
      .should('have.class', 'is-visible')
      .and('contain', 'Ingresá un email válido')
  })

  it('al escribir en email se limpia el error', () => {
    cy.get('[data-cy="register-name"]').type('test')
    cy.get('[data-cy="register-email"]').type('email@invalido')
    cy.get('[data-cy="register-password"]').type('12345678') 
    cy.get('[data-cy="register-password2"]').type('12345678')
    cy.get('[data-cy="register-submit"]').click()
    cy.get('[data-cy="register-error-email"]').should('have.class', 'is-visible')

    cy.get('[data-cy="register-email"]').type('x')
    cy.get('[data-cy="register-error-email"]').should('not.have.class', 'is-visible')
  })

  it('password inválida muestra error', () => {
    cy.get('[data-cy="register-name"]').type('test')
    cy.get('[data-cy="register-email"]').type('ok@mail.com')
    cy.get('[data-cy="register-password"]').type('123') 
    cy.get('[data-cy="register-password2"]').type('123')
    cy.get('[data-cy="register-submit"]').click()

    cy.get('[data-cy="register-error-pwd"]')
      .should('have.class', 'is-visible')
      .and('contain', 'Debe tener al menos 8 caracteres')
  })

  it('al escribir en password se limpia el error', () => {
    cy.get('[data-cy="register-name"]').type('test')
    cy.get('[data-cy="register-email"]').type('ok@mail.com')
    cy.get('[data-cy="register-password"]').type('123')
    cy.get('[data-cy="register-password2"]').type('123')
    cy.get('[data-cy="register-submit"]').click()

    cy.get('[data-cy="register-error-pwd"]').should('have.class', 'is-visible')

    cy.get('[data-cy="register-password"]').type('456789')
    cy.get('[data-cy="register-error-pwd"]').should('not.have.class', 'is-visible')
  })

  it('passwords que no coinciden muestra error', () => {
    cy.get('[data-cy="register-name"]').type('test')
    cy.get('[data-cy="register-email"]').type('ok@mail.com')
    cy.get('[data-cy="register-password"]').type('12345678')
    cy.get('[data-cy="register-password2"]').type('12345679')
    cy.get('[data-cy="register-submit"]').click()

    cy.get('[data-cy="register-error-pwd2"]')
      .should('have.class', 'is-visible')
      .and('contain', 'Las contraseñas no coinciden')
  })

  it('al escribir en confirmación se limpia el error', () => {
    cy.get('[data-cy="register-name"]').type('test')
    cy.get('[data-cy="register-email"]').type('ok@mail.com')
    cy.get('[data-cy="register-password"]').type('12345678')
    cy.get('[data-cy="register-password2"]').type('12345679')
    cy.get('[data-cy="register-submit"]').click()

    cy.get('[data-cy="register-error-pwd2"]').should('have.class', 'is-visible')

    cy.get('[data-cy="register-password2"]').clear().type('12345678')
    cy.get('[data-cy="register-error-pwd2"]').should('not.have.class', 'is-visible')
  })

  it('con todo correcto redirige a /', () => {
    cy.get('[data-cy="register-name"]').type('test')
    cy.get('[data-cy="register-email"]').type('ok@mail.com')
    cy.get('[data-cy="register-password"]').type('12345678')
    cy.get('[data-cy="register-password2"]').type('12345678')

    cy.get('[data-cy="register-submit"]').click()
    cy.location('pathname').should('eq', '/')
  })

  it('click en "ya tengo cuenta" vuelve al login', () => {
    cy.get('[data-cy="register-back-link"]').click()
    cy.location('pathname').should('include', '/auth/login')
  })
})

