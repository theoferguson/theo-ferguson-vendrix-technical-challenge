# 💳 Technical Challenge @ Backend

This guide is an example of how to develop a function in Typescript with
the Google Cloud Functions Framework with Debugging.

The frontend challenge consists of a basic form to gather data for a new user. The tech stack used includes:

- node
- express
- redis

## Summary

Add functionality to the "ingressFunction" so that a GET requests made to the route /card/:cardId (/card/cd_392411ed344b112faa1e024f633516e4) responds with basic payment card details of the card Id passed in the params. In order to implement this feature you will need to differentiate between the existing "users" functionality and requests for cards details from within the "ingressFunction", then take the cardId and make a query to the Highnote platform and return the response. You will need to implement a graphql client to fetch the information about the card. A query has been provided and is located int he graphql folder. This API utilizes a Basic API key that should be Base64 encoded and added to the "Authorization" header. The API key should be stored as an environmental variable and not committed to git. The API key will be shared with you via an email.

You can read more about the Highnote platform API at: https://highnoteplatform.com/docs

- [ ] Add logic to "ingressFunction" to determine when a card detail request is being made vs. user request (existing functionality)

- [ ] Query the Highnote API, and return the card details to the client

- [ ] Requests made to /cards/:cardId should return details about the card based on the ID provided

- [ ] All other requests made to the endpoint should result in the existing function functionality