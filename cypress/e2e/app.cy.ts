describe('Hotel Finder', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
    cy.get('h1').contains('Hotel Finder');
    cy.wait(1000); // Wait for 1 second (adjust the duration as needed)
  });

  it('should render the first 5 hotels initially', () => {
    cy.get('[data-testid="hotel-list-container"]')
      .children()
      .should('have.length', 5);
  });

  it('should render 2 hotels after clicking 1 star filter', () => {
    cy.get('[data-testid="checkbox-1"]').click();
    cy.get('[data-testid="hotel-list-container"]')
      .children()
      .should('have.length', 2);
  });

  it('should render 2 hotels after clicking 1 star filter and then 5 after removing it', () => {
    const checkbox = cy.get('[data-testid="checkbox-1"]');
    checkbox.click();
    cy.get('[data-testid="hotel-list-container"]')
      .children()
      .should('have.length', 2);
    checkbox.click();
    cy.get('[data-testid="hotel-list-container"]')
      .children()
      .should('have.length', 5);
  });
});
