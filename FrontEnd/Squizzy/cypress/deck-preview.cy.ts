import { DeckPreviewComponent } from "src/app/deck-preview/deck-preview.component"

describe('deck-preview.cy.ts', () => {
  it('playground', () => {
     cy.mount(DeckPreviewComponent)
  })
})