const qa = (val) => `[data-qa='${val}']`
const hitStats = () => cy.get(`${qa('hits-stats')} > ${qa('info')}`)
const hits = () => cy.get("[data-qa=hits] > div")
const searchInput = () => cy.get("[data-qa=query]")
const texts = ($p) => {
    return $p.map((i, el) => {
        return Cypress.$(el).text()
    }).get()
}

describe('Searchkit taxonomy test', function () {

    beforeEach(() => {
        cy.server()
        cy.route('POST', '/api/taxonomy/_search').as('search')
        cy.visit('/taxonomy-app')
        cy.wait("@search")
    })

    it('Should have correct hit counts', function () {
        cy.get("[data-key='Central America']").click()
        cy.wait("@search")
        cy.get("[data-key='Central America']+div [data-qa='option']").should(($p)=> {
            expect(texts($p)).to.deep.eq([
                "Panama204", "Costa Rica 195", "Venezuela179"
            ])
        })
    })


})