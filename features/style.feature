@style
Feature: Validate OSCAL Metaschema Style 
  As a developer
  I want to OSCAL metaschemas to conform to a particular style

Background: 
    Given the metaschema directory is "./OSCAL/src/metaschema"

Scenario Outline: Validate OSCAL style guide
    When I validate "<metaschema>" metaschema it passes style guide
    Then Sarif output should not contain failing rules
    And Sarif output should contain passing rules

    Examples:
      | metaschema    |
      | profile |
      | catalog |
      | ssp |
      | poam |
      | assessment-common |
      | implementation-common |
      | assessment-plan |
      | assessment-results |