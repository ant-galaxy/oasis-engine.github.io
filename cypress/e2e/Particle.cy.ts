describe("Particle", () => {
  //TODO need opt
  it("Particle Render", () => {
    cy.visit(`/mpa/particle-renderer.html`);
    cy.wait(3000);
    cy.get("#canvas").screenshot("Particle_particle-renderer", {
      overwrite: true,
    });
  });

  //TODO need opt
  it("Particle Render", () => {
    cy.visit(`/mpa/particle-sprite-sheet.html`);
    cy.wait(3000);
    cy.get("#canvas").screenshot("Particle_particle-sprite-sheet", {
      overwrite: true,
    });
  });
});
