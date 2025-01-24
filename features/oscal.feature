@integration
Feature: Validate OSCAL Content
  As a developer
  I want to validate OSCAL content against appropriate metaschemas

  Background: 
    Given the OSCAL CLI tool is installed
    And the metaschema directory is "./OSCAL/src/metaschema"

  Scenario Outline: Validate OSCAL content
    When I validate OSCAL content in "<path>"
    Then Sarif output should not contain failing rules
    And Sarif output should contain passing rules

    Examples:
      | path                         |
      | https://raw.githubusercontent.com/usnistgov/oscal-content/refs/heads/main/examples/ssp/xml/ssp-example.xml   |
      | https://raw.githubusercontent.com/usnistgov/oscal-content/refs/heads/main/examples/poam/xml/ifa_plan-of-action-and-milestones.xml           |
      | https://raw.githubusercontent.com/usnistgov/oscal-content/refs/heads/main/examples/component-definition/xml/example-component-definition.xml                |
      | https://raw.githubusercontent.com/usnistgov/oscal-content/refs/heads/main/examples/ap/xml/ifa_assessment-plan-example.xml|
      | https://raw.githubusercontent.com/usnistgov/oscal-content/refs/heads/main/examples/component-definition/xml/example-component-definition.xml              |
      | https://raw.githubusercontent.com/usnistgov/oscal-content/refs/heads/main/examples/ar/xml/ifa_assessment-results-example.xml       |
