    Feature: Login Web Swag Labs
    
    Background:
        Given I am on the Swag Labs login page

    @positive
    Scenario Outline: Verify successful login with valid credentials <kondisi>
        When I enter the username "<user_tipe>"
        And  I enter the password "secret_sauce"
        And  I click the login button
        Then I should be redirected to the Product Dashboard page
        
        Examples:
            | kondisi         | user_tipe               |
            | User Biasa      | standard_user           |
            | User Bermasalah | problem_user            |

    @negative
    Scenario Outline: Verify failed login with invalid username <kondisi>
        When I enter the username "<username_variasi>"
        And I enter the password "secret_sauce"
        And I click the login button
        Then I should see an error message

        Examples:
            | kondisi             | username_variasi          |
            | Huruf Biasa         | standard                  |
            | Variasi Simbol      | standard!@#               |
            | Variasi Angka       | standard123               |
            | Variasi Huruf Besar | StAnDaRD                  |
            | HTML Injection      | <h1>user</h1>             |
            | XSS Script          | <script>alert(1)</script> |
            | User Locked Out     | locked_out_user           |

    @negative
    Scenario Outline: Verify failed login with invalid password <kondisi>
        Given I am on the Swag Labs login page
        When I enter the username "standard_user"
        And I enter the password "<password_variasi>"
        And I click the login button
        Then I should see an error message

        Examples:
            | kondisi             | password_variasi          |
            | Huruf Biasa         | standard                  |
            | Variasi Simbol      | standard!@#               |
            | Variasi Angka       | standard123               |
            | Variasi Huruf Besar | StAnDaRD                  |
            | HTML Injection      | <h1>user</h1>             |
            | XSS Script          | <script>alert(1)</script> |

    @negative
    Scenario Outline: Verify failed login with invalid username and password with <kondisi>
        Given I am on the Swag Labs login page
        When I enter the username "<username_variasi>"
        And I enter the password "<password_variasi>"
        And I click the login button
        Then I should see an error message

        Examples:
            | kondisi             | username_variasi          | password_variasi          |
            | Huruf Biasa         | standard                  | standard                  |
            | Variasi Simbol      | standard!@#               | standard!@#               |
            | Variasi Angka       | standard123               | standard123               |
            | Variasi Huruf Besar | StAnDaRD                  | StAnDaRD                  |
            | HTML Injection      | <h1>user</h1>             | <h1>user</h1>             |
            | XSS Script          | <script>alert(1)</script> | <script>alert(1)</script> |

    @negative
    Scenario Outline: Verify failed login with invalid username and password with <kondisi>
        Given I am on the Swag Labs login page
        When I enter the username "<username_variasi>"
        And I enter the password "<password_variasi>"
        And I click the login button
        Then I should see an error message

        Examples:
            | kondisi         | username_variasi | password_variasi |
            | Username Kosong |                  | secret_sauce     |
            | Password Kosong | standard_user    |                  |
            | Keduanya Kosong |                  |                  |
