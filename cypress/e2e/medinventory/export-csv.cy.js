/// <reference types="cypress" />

const API_URL = Cypress.env("API_URL") || "http://localhost:8080";

async function ensureUser({ nome, username, email, password, tipo }) {
  try {
    await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, username, email, password, tipo }),
    });
  } catch (_) {
  }
}

describe("Exportar CSV (frontend + backend)", () => {
  before(() => {
    return cy.then(async () => {
      await ensureUser({
        nome: "Admin E2E",
        username: "admin_e2e",
        email: "admin_e2e@example.com",
        password: "Admin123!",
        tipo: "Administrador",
      });
      await ensureUser({
        nome: "Gestor E2E",
        username: "gestor_e2e",
        email: "gestor_e2e@example.com",
        password: "Gestor123!",
        tipo: "Gestor",
      });
      await ensureUser({
        nome: "Tecnico E2E",
        username: "tecnico_e2e",
        email: "tecnico_e2e@example.com",
        password: "Tec123!",
        tipo: "Tecnico",
      });
    });
  });

  function loginViaApi(username, password) {
    return cy
      .request({
        method: "POST",
        url: `${API_URL}/auth/login`,
        body: { username, password },
        failOnStatusCode: false,
      })
      .then((resp) => {
        expect([200, 201]).to.include(resp.status);
        expect(resp.body).to.have.property("access_token");
        expect(resp.body).to.have.property("user");
        return resp.body;
      });
  }

  function visitEquipmentWithAuth({ token, user }) {
    return cy.visit("/equipment", {
      onBeforeLoad(win) {
        win.localStorage.setItem("token", token);
        win.localStorage.setItem("user", JSON.stringify(user));
      },
    });
  }

  it("ADMINISTRADOR consegue exportar CSV (200 + text/csv)", () => {
    loginViaApi("admin_e2e", "Admin123!").then(({ access_token, user }) => {
      cy.intercept("GET", "**/equipamentos/export/csv*").as("exportCsv");
      visitEquipmentWithAuth({ token: access_token, user });

      cy.get("button.equipment-export-btn")
        .should("be.visible")
        .and("not.be.disabled")
        .click();

      cy.wait("@exportCsv").then((interception) => {
        const status = interception.response?.statusCode;
        expect([200, 304]).to.include(status);
        if (status === 200) {
          const ct = interception.response?.headers?.["content-type"] || "";
          expect(ct).to.include("text/csv");
        }
      });
    });
  });

  it("GESTOR consegue exportar CSV (200 + text/csv)", () => {
    loginViaApi("gestor_e2e", "Gestor123!").then(({ access_token, user }) => {
      cy.intercept("GET", "**/equipamentos/export/csv*").as("exportCsv");
      visitEquipmentWithAuth({ token: access_token, user });

      cy.get("button.equipment-export-btn")
        .should("be.visible")
        .and("not.be.disabled")
        .click();

      cy.wait("@exportCsv").then((interception) => {
        const status = interception.response?.statusCode;
        expect([200, 304]).to.include(status);
        if (status === 200) {
          const ct = interception.response?.headers?.["content-type"] || "";
          expect(ct).to.include("text/csv");
        }
      });
    });
  });

  it("TECNICO não pode exportar (botão desabilitado e API retorna 403)", () => {
    loginViaApi("tecnico_e2e", "Tec123!").then(({ access_token, user }) => {
      visitEquipmentWithAuth({ token: access_token, user });

      cy.get("button.equipment-export-btn")
        .should("be.visible")
        .and("be.disabled");

      cy.request({
        method: "GET",
        url: `${API_URL}/equipamentos/export/csv`,
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "text/csv",
        },
        failOnStatusCode: false,
      }).then((resp) => {
        expect(resp.status).to.eq(403);
      });
    });
  });
});

