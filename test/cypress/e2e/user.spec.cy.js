
describe('User Page', () => {
    beforeEach(() => {
        cy.visit("/");
        cy.get('[routerlink="/users"]').click();
    });

    it('Should load user table', () => {
        cy.get('.mat-mdc-table');

    });

    it('Should display right column names', () => {
        cy.contains('Id');
        cy.contains('Name');
        cy.contains('Username');
        cy.contains('Email');
        cy.contains('Role');
    });

    it.only('Should navigate next page', () => {
        cy.get('[aria-label="Next page"]').click();

    });

    it.only('Should filter user by username', () => {
        cy.contains('mat-label', 'Filter with debouncer').type('admin');
        cy.get('.mat-mdc-table').find('.mat-mdc-row').should('have.length', 1);
    })
}) 