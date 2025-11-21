describe("Pruebas API PetStore", () => {

    // Variable donde guardaremos el ID de la mascota creada
    let petId;

    it("1️⃣ Añadir una mascota a la tienda", () => {

        const newPet = {
            id: Date.now(),     // Creamos un id único
            name: "Firulais",
            status: "available"
        };

        petId = newPet.id; // Guardamos id para las siguientes pruebas

        cy.request({
            method: "POST",
            url: "https://petstore.swagger.io/v2/pet",
            body: newPet
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.name).to.eq("Firulais");
        });

    });

    it("2️⃣ Consultar la mascota ingresada previamente (por ID)", () => {
        cy.request({
            method: "GET",
            url: `https://petstore.swagger.io/v2/pet/${petId}`
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.id).to.eq(petId);
        });
    });

    it("3️⃣ Actualizar el nombre y estatus de la mascota a 'sold'", () => {
        const updatedPet = {
            id: petId,
            name: "FirulaisV2",
            status: "sold"
        };

        cy.request({
            method: "PUT",
            url: "https://petstore.swagger.io/v2/pet",
            body: updatedPet
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.status).to.eq("sold");
        });
    });

    it("4️⃣ Consultar la mascota modificada por estatus (sold)", () => {
        cy.request({
            method: "GET",
            url: "https://petstore.swagger.io/v2/pet/findByStatus?status=sold"
        }).then((response) => {
            expect(response.status).to.eq(200);

            // Buscamos nuestra mascota dentro del array
            const foundPet = response.body.find(p => p.id === petId);

            expect(foundPet).to.not.be.undefined;
            expect(foundPet.status).to.eq("sold");
        });
    });

});
