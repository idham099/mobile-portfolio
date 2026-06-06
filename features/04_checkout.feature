Feature: Checkout Validation

Background:
    Given I am on the Swag Labs login page
    When I enter the username "standard_user"
    And I enter the password "secret_sauce"
    And I click the login button
    Then I should be redirected to the Product Dashboard page
    
    When I click "Add to Cart" directly for a "Murah" priced product
    And I open the shopping cart page
    When I click the "Checkout" navigation button
    Then I am successfully on the "Checkout Information" page

@positive
Scenario Outline: Verify checkout input validation (Positive) "<firstname>"
  When I enter "<firstname>" as firstname
  And I enter "<lastname>" as lastname
  And I enter "<zipcode>" as zipcode
  And I click the "Continue" button
  And I should see checkout overview page is displayed
  And I click the "Finish" button
  And I verify checkout complete page is displayed
  And I click the "Back Home" button
  And I should be redirected to the product dashboard page
  And I Click menu widget button
  And I Click the "Logout" button 

    Examples:
      | firstname | lastname | zipcode | 
      | John      | Doe      | 12345   | 
      | JOHN      | doe      | 54321   |                                      


@negative
  Scenario Outline: Verify checkout input validation (negative) "<expected_result>"
    When I enter "<firstname>" as firstname
    And I enter "<lastname>" as lastname
    And I enter "<zipcode>" as zipcode
    And I click the "Continue" button
    Then I should see the result "<expected_result>"

    Examples:
      | firstname | lastname | zipcode | expected_result          |
      |           | Doe      | 12345   | First Name is required   |
      | John      |          | 12345   | Last Name is required    |
      | John      | Doe      |         | Postal Code is required  |

