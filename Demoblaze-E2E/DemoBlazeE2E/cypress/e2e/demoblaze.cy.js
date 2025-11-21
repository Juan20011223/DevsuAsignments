

describe('Flujo de compra completo en DemoBlaze', () => {

    const comprador = {
        nombre: 'Juan Romero',
        pais: 'Ecuador',
        ciudad: 'Tumbaco',
        tarjeta: '1734537237',
        mes: '11',
        anio: '2026'
    };

    // Funcion que sirve para poder agregar productos al carrito
    function agregarProductoPorIndice(indice) {
        cy.log(`Agregando el producto al su indice ${indice}`);

        cy.get('.card-title a')
            .should('have.length.greaterThan', indice)
            .eq(indice)
            .then($producto => {
                const nombreProd = $producto.text().trim();
                cy.log(`Producto encontrado: ${nombreProd}`);

                cy.wrap($producto).click();
                cy.log('Entrando a la tab del producto ');

                // Validar que abrió correctamente la página del producto
                cy.get('.name')
                    .should('be.visible')
                    .and('contain.text', nombreProd);

                cy.on('window:alert', (mensaje) => {
                    expect(mensaje).to.match(/Product added/i);
                });

                cy.contains('Add to cart')
                    .should('be.visible')
                    .click();

                cy.log(`Producto agregado con exito: ${nombreProd}`);
            });
    }

    // Función para ocmpletar el fformualrio de la compra de los productos
    function llenarFormularioCompra(datos) {
        cy.get('#name').clear().type(datos.nombre);
        cy.get('#country').clear().type(datos.pais);
        cy.get('#city').clear().type(datos.ciudad);
        cy.get('#card').clear().type(datos.tarjeta);
        cy.get('#month').clear().type(datos.mes);
        cy.get('#year').clear().type(datos.anio);

        cy.log('Formularioo completado');
    }

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.log('Browser limpiado');
    });

    it('Agregar dos productos al carrito, revisar total y completar compra', () => {

        //------------------------------
        // 1) VISITAR LA PÁGINA PRINCIPAL
        //------------------------------
        cy.visit('/');

        cy.contains('CATEGORIES', { matchCase: false })
            .should('be.visible');

        //------------------------------
        // 2) AGREGAR PRODUCTO 1
        //------------------------------
        agregarProductoPorIndice(0);

        // Volver al home de forma segura
        cy.contains('Home').click();
        cy.url().should('include', 'https://www.demoblaze.com/');  // Confirma si esque el usuario realmente esta en home


        //------------------------------
        // 3) AGREGAR PRODUCTO 2
        //------------------------------
        agregarProductoPorIndice(1);

        //------------------------------
        // 4) IR AL CARRITO
        //------------------------------

        cy.get('#cartur').click();
        cy.url().should('include', 'cart.html'); // comprueba que el browser este en la pagina de el carritp 

        cy.log('Viendo productos del carrito');

        // Verificar que haya exactamente 2 productos
        cy.get('#tbodyid tr')
            .should('have.length', 2)
            .then($filas => {
                cy.log(`Hay ${$filas.length} productos en el carrito`);
            });

        //------------------------------
        // 5) VALIDAR TOTAL SUMADO
        //------------------------------

        cy.get('#tbodyid tr').then($rows => {
            const precios = [];

            $rows.each((i, row) => {
                const precio = Number(
                    Cypress.$(row).find('td').eq(2).text().trim()
                );
                precios.push(precio);
            });

            const sumaEsperada = precios.reduce((s, p) => s + p, 0);

            cy.log(`💲 Suma esperada: ${sumaEsperada}`);

            cy.get('#totalp').then($total => {
                const totalPagina = Number($total.text());
                cy.log(`TOTAL: ${totalPagina}`);
                expect(totalPagina).to.eq(sumaEsperada);
            });
        });

        //------------------------------
        // 6) PLACE ORDER
        //------------------------------
        cy.contains('Place Order').click();

        cy.get('#orderModal')
            .should('be.visible')
            .within(() => {
                llenarFormularioCompra(comprador);

                cy.contains('Purchase')
                    .should('be.visible')
                    .click();
            });

        //------------------------------
        // 7) CONFIRMACIÓN DE COMPRA
        //------------------------------
        cy.log('Conf de la compra');

        cy.get('.sweet-alert, .lead, .confirm')
            .should('be.visible')
            .then($caja => {
                const texto = $caja.text().toLowerCase();
                expect(texto).to.include('thank');// Valida si contiene estas palabras para validar que se compro con exito
                expect(texto).to.include('purchase');
            });

        //------------------------------
        // 8) TOMAR SCREENSHOT
        //------------------------------
        cy.screenshot('compra-finalizada');

        // Cerrar modal final si existe botón
        cy.contains(/ok|close/i).click({ force: true });

        cy.log('La compra fue exitosa');
    });
});
