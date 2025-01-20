describe('API Response Test', () => {
  
  const token = Cypress.env('authToken');

  it('should verify the number of users and their properties', () => {
      cy.request({
          method: 'GET',
          url: '/users',
          headers: {
              Authorization: token
          }
      }).then((res) => {
          // Check that the request was successful
          expect(res.status).to.eq(200);

          // Verify that the number of objects in the response is 10
          expect(res.body).to.have.lengthOf(10);

          // Verify each object in the response
          res.body.forEach(user => {
              expect(user).to.have.property('id').that.is.a('number');
              expect(user).to.have.property('name').that.is.a('string');
              expect(user).to.have.property('email').that.is.a('string');
              expect(user).to.have.property('gender').that.is.oneOf(['male', 'female']);
              expect(user).to.have.property('status').that.is.oneOf(['active', 'inactive']);
          });
      });
  });
  
  it('should handle unauthorized access with invalid token', () => {
    cy.request({
        method: 'GET',
        url: '/users', // Using baseUrl
        headers: {
            Authorization: 'Bearer invalid_token'
        },
        failOnStatusCode: false,
    }).then((res) => {
        // Log response for debugging purposes
        cy.log(JSON.stringify(res));

        // Verify that the response status is 401 (Unauthorized)
        expect(res.status).to.eq(401);
    });
});

  it('should handle invalid endpoint', () => {
      cy.request({
          method: 'GET',
          url: '/invalid-endpoint',
          headers: {
              Authorization: token
          },
          failOnStatusCode: false, // Do not throw an error for status codes other than 2xx
      }).then((res) => {
          // Verify that the response status is 404 (Not Found)
          expect(res.status).to.eq(404);
      });
  });
});
