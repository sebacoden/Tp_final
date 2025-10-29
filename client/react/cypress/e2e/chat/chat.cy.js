import { beforeEach } from "node:test"

describe('Chat', () => {
    beforeEach(() => {
        cy.visit('/chat')
    })

    //Layout testing
    it('La barra lateral se abre y cierra al hacer click en el boton correspondiente', () => {
        cy.get('[data-cy="sidebar-toggle"]').click()
        cy.get('.sidebar').should('have.class', 'open')
        cy.get('[data-cy="sidebar-toggle"]').click()
        cy.get('.sidebar').should('not.have.class', 'open')
    })
})