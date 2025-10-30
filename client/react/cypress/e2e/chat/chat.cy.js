describe("Chat", () => {
  beforeEach(() => {
    cy.visit("/chat");
  });

  // Layout tests
  it("La barra lateral se abre y cierra al hacer click en el boton del header", () => {
    cy.get('[data-cy="btn-sidebar"]').click();
    cy.get('[data-cy="sidebar"]').should("have.class", "open");
    cy.get('[data-cy="btn-sidebar"]').click();
    cy.get('[data-cy="sidebar"]').should("not.have.class", "open");
  });

  it("Los enlaces del sidebar redirigen correctamente", () => {
    cy.get('[data-cy="btn-sidebar"]').click();
    cy.get('[data-cy="sidebar"]').within(() => {
      cy.get('[data-cy="iniciar-sesion"]').click();
    });
    cy.location("pathname").should("include", "/auth/login");
  });

  // Chat tests
  describe("Si se envia un mensaje y recibe respuesta", () => {
    beforeEach(() => {
      cy.intercept("GET", "**", {
        statusCode: 200,
        body: { natural_language_response: "Hola, ¿en qué puedo ayudarte?" },
      }).as("getRespuesta");

      cy.get('[data-cy="mensaje-input"]').type("Hola{enter}");
    });

    it("El input se bloquea hasta obtener una respuesta", () => {
      cy.get('[data-cy="mensaje-input"]').should("be.disabled");
      cy.wait("@getRespuesta");
      cy.get('[data-cy="mensaje-input"]').should("not.be.disabled");
    });

    it("El mensaje enviado y la respuesta se muestran en el chat", () => {
      cy.wait("@getRespuesta");
      cy.get(".mensaje").should("have.length", 2);
      cy.get(".mensaje.usuario").should("contain.text", "Hola");
      cy.get(".mensaje.asistente").should(
        "contain.text",
        "Hola, ¿en qué puedo ayudarte?"
      );
    });
  });

  describe("Si hay un error al enviar el mensaje", () => {
    beforeEach(() => {  //Esto queda asi por si despues se me ocurren mas tests relacionado a errores.
      cy.intercept("GET", "**", {
        statusCode: 500,
      }).as("getError");
      cy.get('[data-cy="mensaje-input"]').type("Hola{enter}");
    });

    it("No se agregan mensajes al chat", () => {
      cy.wait("@getError");
      cy.get(".mensaje").should("have.length", 0);
    });
  });
});
