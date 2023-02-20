describe('template spec', () => {

  beforeEach(() => {
    // run these tests as if in a desktop
    // browser with a 720p monitor
    cy.viewport(1920, 1080)
  })
  
  it('passes', () => {
    cy.visit('http://localhost:4200')
  })
})