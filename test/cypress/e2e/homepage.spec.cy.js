describe('Homepage', () => {
    it('Should load successfully', () => {
        cy.visit('/')
    });

    it('Should contain right spelled texts', () => {
        cy.visit('/');
        cy.contains('Users');
        cy.contains('Admin');
        cy.contains('Login');
        cy.get('mat-select').click();
        cy.contains('Register');
    })
})