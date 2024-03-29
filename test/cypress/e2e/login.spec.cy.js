import { USERNAME, PASSWORD } from "../integration/constant";

describe('Test Login Flow', () => {

    it('Should login user', () => {
        cy.visit('/login');
        cy.get('[formcontrolname="email"').type(USERNAME);
        cy.get('[formcontrolname="password"]').type(PASSWORD);
        cy.get('[type="submit"]').click();
        cy.url().should('include', 'admin');

    });
})