describe("CRUD Usuario en PetStore API", () => {

    const baseUrl = "https://petstore.swagger.io/";
    const username = "juanTestUser";
    const updatedUsername = "juanUserActualizado";

    // Datos base para prueba
    let userData = {
        id: 1001,
        username: username,
        firstName: "Juan",
        lastName: "Romero",
        email: "juan@test.com",
        password: "1234",
        phone: "099349345299",
        userStatus: 1
    };

    function api(method, endpoint, body = null) {
        return cy.request({
            method,
            url: `${baseUrl}${endpoint}`,
            body,
            failOnStatusCode: false
        });
    }

    //funcion que espera hasta que haya un usuario
    function waitForUser(username, attempts = 5) {
        if (attempts === 0) throw new Error("No se pudo verificar el usuario");

        return api("GET", `/user/${username}`).then(res => {
            if (res.status === 200) return res;

            cy.wait(1000);
            return waitForUser(username, attempts - 1);
        });
    }

    // Funcion que elimina el usuario con varios reintentos
    function deleteUser(username, attempts = 5) {
        if (attempts === 0) {
            throw new Error(`❌ No fue posible eliminar al usuario: ${username}`);
        }

        // 1️⃣ Verificar si existe antes de intentar borrar
        return api("GET", `/user/${username}`).then(getRes => {

            if (getRes.status === 404) {
                // Ya no existe, prueba exitosa
                return { status: 200, message: "Already deleted" };
            }

            // 2️⃣ Intentar borrarlo
            return api("DELETE", `/user/${username}`).then(delRes => {

                if (delRes.status === 200) {
                    return delRes; // borrado exitoso ✔
                }

                cy.wait(1000); // 🔁 reintentar
                return deleteUser(username, attempts - 1);
            });
        });
    }


    before(() => {
        api("POST", "/user", userData);
        return waitForUser(username);  // ⬅️ Esto hace la prueba estable ya que daba error 404 , no encontraba al usuario asi que lo creo andtes de los it
    });

    it("1️ Crear usuario (verificación)", () => {
        waitForUser(username).then(res => {
            expect(res.body.username).to.eq(username);
        });
    });


    it("2️ Buscar usuario creado", () => {
        waitForUser(username).then(res => {
            expect(res.status).to.eq(200);
            expect(res.body.email).to.eq("juan@test.com");
        });
    });

    it("3️ Actualizar nombre y correo", () => {
        const updatedData = {
            ...userData,
            username: updatedUsername,
            email: "nuevo_correo@test.com"
        };

        api("PUT", `/user/${username}`, updatedData).then(res => {
            expect(res.status).to.eq(200);
        });

        userData = updatedData;

        waitForUser(updatedUsername).then(res => {
            expect(res.body.username).to.eq(updatedUsername);
            expect(res.body.email).to.eq("nuevo_correo@test.com");
        });
    });

    it("4️ Eliminar usuario", () => {
        deleteUser(updatedUsername).then(res => {
            expect([200, 404]).to.include(res.status);
        });
    });

    it("5️ Confirmar que ya no existe", () => {
        api("GET", `/user/${updatedUsername}`).then(res => {
            expect(res.status).to.eq(404);
            expect(res.body.message).to.eq("User not found");
        });
    });

});
