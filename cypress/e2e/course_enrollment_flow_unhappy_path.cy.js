/// <reference types="cypress" />

// Unhappy path: προσπαθώ να κάνω enroll σε premium course (PMP) χωρίς login
describe('Course Enrollment Flow - Unhappy path (PMP premium)', () => {
  it('shows an error when trying to enroll in "PMP Certification Prep" while logged out', () => {

    // Step 1: Visit Home page
    cy.visit('/');

    // Step 2: Search "PMP"
    cy.get('[data-cy="search-input"]')
      .should('be.visible')
      .type('PMP');

    // Submit the search form
    cy.get('form').submit();

    // Τώρα πρέπει να είμαστε στη σελίδα /courses
    cy.url().should('include', '/courses');

    // Optional: Apply filters, αν χρειάζονται
    cy.contains('button', 'Apply').click({ force: true });

    // Step 3: Βρίσκω το "PMP Certification Prep" στα αποτελέσματα και πατάω "See More"
    cy.contains('[data-cy="course-card"]', 'PMP Certification Prep')
      .should('be.visible')
      .within(() => {
        cy.get('[data-cy="see-more-course"]').click();
      });

    // Course details page
    cy.url().should('include', '/courses');

    // Τσεκ ότι είμαστε όντως στο PMP
    cy.get('h1').should('contain', 'PMP');

    // --------------------------------------
    // Step 4: Προσπάθεια enroll σε premium course
    // --------------------------------------

    // Στήνω stub για window.alert
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    // Πατάω το Enroll button
    cy.get('[data-cy="enroll-button"]').should('be.visible').click();

    // Περιμένω το alert για premium course
    cy.get('@alert').should(
      'have.been.calledWith',
      'Failed to enroll: Course is premium. Upgrade to enroll'
    );
  });
});
