const qa = (val) => `[data-qa='${val}']`
const hitStats = () => cy.get(`${qa('hits-stats')} > ${qa('info')}`)
const hits = () => cy.get("[data-qa=hits] > div")
const searchInput = () => cy.get("[data-qa=query]")

describe('Searchkit UMD import test', function () {

    beforeEach(() => {
        cy.server()
        cy.route('POST', '/api/movies/_search').as('search')
        cy.visit('/theme-app')
        cy.wait("@search")
    })

    it('Should have correct hit counts', function () {
        hitStats().should('contain', '4162 results found')
        hits().should('have.length', 12)
    })
   

})