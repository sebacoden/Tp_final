describe('Auth - Recover', () => {
  beforeEach(() => {
    cy.visit('/auth/recover')
  })

  it('muestra error con email inválido', () => {
    cy.get('[data-cy="recover-email"]').type('email@invalido')
    cy.get('[data-cy="recover-submit"]').click()

    cy.get('[data-cy="recover-error"]')
      .should('have.class', 'is-visible')
      .and('contain', 'Ingresá un email válido')
  })

  it('al escribir nuevamente el error desaparece', () => {
    cy.get('[data-cy="recover-email"]').type('email@invalido')
    cy.get('[data-cy="recover-submit"]').click()
    cy.get('[data-cy="recover-error"]').should('have.class', 'is-visible')

    cy.get('[data-cy="recover-email"]').type('x')
    cy.get('[data-cy="recover-error"]').should('not.have.class', 'is-visible')
  })

  it('con email válido muestra mensaje OK', () => {
    cy.get('[data-cy="recover-email"]').clear().type('alguien@mail.com')
    cy.get('[data-cy="recover-submit"]').click()

    cy.get('[data-cy="recover-success"]')
      .should('be.visible')
      .and('contain', 'Si el email está registrado')
  })

  it('click en "Iniciar sesión" redirige al login', () => {
    cy.get('[data-cy="recover-back-link"]').click()
    cy.location('pathname').should('include', '/auth/login')
  })
})