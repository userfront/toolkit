# Userfront Toolkit

Toolkit repo, containing:

- Elements library: buttons, inputs, and such, for use in forms
- Forms library: signup, login, and password reset forms that take some JSON with configuration & state and display the form in that state
- Models library: models (statecharts) for signup, login, and password reset forms that are initialized with JSON configuration, receive events from the forms and the context, and produce some JSON for the forms on state change
- Toolkit package: all three of the above, integrated and served as Web Components
- Build configuration & integration tests for the above

Currently contains other packages, but may split back out into their own repos:
- @userfront/react + Toolkit
- @userfront/vue + Toolkit