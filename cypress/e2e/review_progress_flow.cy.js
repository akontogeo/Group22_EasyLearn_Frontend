/// <reference types="cypress" />

describe('Review & Progress Flow', () => {
  it('visits My Courses, finds the course and then submits a review', () => {
    // 🔹 Step 0: Πάμε στο My Courses του user 1
    cy.visit('/users/1/courses');

    // Βεβαιώσου ότι άνοιξε σωστά το dashboard
    cy.get('[data-cy="dashboard-header"]').should('contain', 'MY COURSES');

    // Αν υπάρχει "Show More", πάτα το για να εμφανιστούν όλα τα courses
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="dashboard-show-more"]').length) {
        cy.get('[data-cy="dashboard-show-more"]').click();
      }
    });

    // Τσέκαρε ότι το μάθημα υπάρχει στη λίστα My Courses
    cy.contains('[data-cy="my-course-card"]', 'Introduction to Python')
      .should('be.visible');

    // 🔹 Από εδώ και κάτω συνεχίζουμε όπως πριν,
    // στη σελίδα του course όπου υπάρχει progress + review UI
    cy.visit('/courses/1');

    // Αν υπάρχει κουμπί Enroll → κάνε enroll
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="enroll-button"]').length > 0) {
        cy.get('[data-cy="enroll-button"]').click();
        cy.get('[data-cy="enroll-success"]').should('be.visible');
      }
    });

    // 🔹 Progress section
    cy.get('[data-cy="progress-indicator"]').should('contain', 'Progress');

    // 🔹 Υποβολή review
    cy.get('[data-cy="review-input"]').clear().type('Great course!');
    cy.get('[data-cy="review-submit-button"]').click();

    cy.get('[data-cy="review-success"]').should('be.visible');
    cy.get('[data-cy="review-list"]').should('contain', 'Great course!');
  });
});
