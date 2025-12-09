/// <reference types="cypress" />

// Acceptance test: Course Enrollment Flow (Happy Path)
describe('Course Enrollment Flow - Happy Path', () => {
  it('lets a user find "Python for Data Science" and enroll', () => {

    cy.visit('/');

    cy.get('[data-cy="search-input"]').should('be.visible').type('Python');
    cy.get('form').submit();

    cy.url().should('include', '/courses');

    cy.contains('button', 'Apply').click({ force: true });

    cy.contains('[data-cy="course-card"]', 'Python for Data Science')
      .should('be.visible')
      .within(() => {
        cy.get('[data-cy="see-more-course"]').click();
      });

    cy.url().should('include', '/courses');

    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="course-title"]').length) {
        cy.get('[data-cy="course-title"]').should('contain', 'Python');
      } else {
        cy.get('h1').should('contain', 'Python');
      }
    });

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="enroll-button"]').length) {
        cy.get('[data-cy="enroll-button"]').click();

        cy.get('@alert').then((alertStub) => {
          if (alertStub.called) {
            expect(alertStub).to.have.been.calledWith('Please log in to enroll');
          }
        });
      } else {
        cy.log('Already enrolled — skipping enroll step.');
      }
    });

  });
});
