@cart @regression
Feature: Swag Labs Shopping Cart Management
  As a standard user
  I want to add, remove, and verify products in the shopping cart
  So that I can ensure the cart state remains accurate across different user journeys

  Background: User is logged in as standard_user and on the Product Dashboard
    Given I am on the Swag Labs login page
    When I enter the username "standard_user"
    And I enter the password "secret_sauce"
    And I click the login button
    Then I should be redirected to the Product Dashboard page

# POSITIVE - SINGLE ITEM PURCHASE (EQUIVALENCE PARTITIONING)
  
  @positive @direct-cart @single-item
  Scenario Outline: Verify adding a single product directly from dashboard with <kondisi_ep> price
    When I click "Add to Cart" directly for a "<kondisi_ep>" priced product
    And I open the shopping cart page for single item
    Then I should see the correct product listed inside the Cart for single item

    Examples:
      | kondisi_ep |
      | Murah      |
      | Sedang     |
      | Mahal      |

  @positive @detail-cart @single-item
  Scenario Outline: Verify adding a single product from product detail page with <kondisi_ep> price
    When I click on a "<kondisi_ep>" priced product to open its detail page
    And I click "Add to Cart" inside the product detail page
    And I open the shopping cart page for detail page
    Then I should see the correct product listed inside the Cart for detail page

    Examples:
      | kondisi_ep |
      | Murah      |
      | Sedang     |
      | Mahal      |

# RUMPUN 2: POSITIVE - MULTIPLE ITEMS PURCHASE
  
 @positive @direct-cart @multiple-items
  Scenario: Verify adding multiple products directly from dashboard
    When I click "Add to Cart" directly for multiple products
    And I open the shopping cart page for multiple items
    Then I should see the correct product listed inside the Cart for multiple items

  @positive @detail-cart @multiple-items
  Scenario: Verify adding multiple products by navigating through each detail page
    When I add multiple products to the cart by opening each product detail page
    And I open the shopping cart page for multiple detail items
    Then I should see all the selected products listed inside the Cart for multiple detail items

# RUMPUN 3: NEGATIVE & EDGE CASES
 
  @negative @cart @empty-state
  Scenario: Verify cart behavior when all items are removed (Empty Cart State)
    When I click "Add to Cart" directly for products "murah, sedang"
    When I open the shopping cart page for empty state
    Then I click the "Remove" button for that product
    
