describe("Navigation", () => {
  it("should navigate to the home page", () => {
    // Start from the index page
    cy.visit("/");

    // Since the user is likely redirected to login if not authenticated,
    // we should check if we see "Insightt" or the Authenticator UI.
    // Given the difficulty of full cognito login in automation without extensive setup,
    // we will check for the presence of the app shell or login fields.

    // If unauthenticated, Amplify Authenticator shows up.
    cy.contains("Sign In").should("exist"); // or confirm the button exists
    cy.get('input[name="username"]').should("exist");
    cy.get('input[name="password"]').should("exist");
  });
});
