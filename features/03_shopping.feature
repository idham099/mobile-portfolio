Feature: Shopping Cart Interactivity
  As a user
  I want to interact with the items in my shopping cart
  So that I can manage my purchase effectively

  Background:
    Given I am on the Swag Labs login page
    When I enter the username "standard_user"
    And I enter the password "secret_sauce"
    And I click the login button
    Then I should be redirected to the Product Dashboard page
    When I click "Add to Cart" directly for a "Murah" priced product
    And I open the shopping cart page

  @cart @actions
  Scenario: Verify removing product from cart
    When I click the "Remove" button in the cart
    Then the product should be removed from the list

  @cart @navigation
  Scenario: Verify continue shopping navigation
    When I click the "Continue Shopping" navigation button
    Then I should be redirected to the "Product Dashboard" page

  @cart @navigation
  Scenario: Verify checkout process
    When I click the "Checkout" navigation button
    Then I should be redirected to the "Checkout Information" page