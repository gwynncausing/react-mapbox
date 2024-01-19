describe("template spec", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("contains a map with marker/s on initialize", () => {
    cy.get('[data-test="map"]').should("exist");
    cy.get('[data-test="map"]').get('[data-test="marker-0"]');
  });

  it("display sidebar with property details when marker clicked", () => {
    cy.get('[data-test="map-wrapper"]')
      .should('not.have.class', 'sidebar-open')
    cy.wait(5000)
    cy.get('[data-test="marker-0"]')
      .first()
      .click({force: true});
    cy.wait(5000)
    cy.get('[data-test="map-wrapper"]')
      .should('have.class', 'sidebar-open')
    cy.contains("8 CLOVERLEIGH AVENUE EMERALD 3782"); // full_address
    cy.contains("CARDINIA"); // council
    cy.contains("3782"); // postcode
    cy.get('[data-test="close-button"]').click()
    cy.get('[data-test="map-wrapper"]')
      .should('not.have.class', 'sidebar-open')
  });

  it.only("be able to filter by location", () => {
    cy.get('[data-test="filters"]')
      .should('exist')
    cy.get('[data-test="filters"]')
      .select('312')
    cy.get('[data-test="marker-0"][data-test-postcode="postcode-3803"]').click(
      { force: true }
    );
    cy.contains("24-32 WESTPOOL DRIVE HALLAM 3803"); // full_address
    cy.contains("CASEY"); // council
    cy.contains("3803"); // postcode
    cy.get('[data-test="close-button"]').click();
    cy.get('[data-test="filters"]').select("");
  })
});
