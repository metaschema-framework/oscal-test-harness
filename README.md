# OSCAL Test Harness

A community-driven test harness for validating OSCAL (Open Security Controls Assessment Language) content. This project provides automated testing and validation of OSCAL models against their corresponding metaschemas, along with style checking capabilities.

## Overview

The OSCAL Test Harness helps ensure OSCAL content adheres to:
- XML Schema validation rules
- OSCAL metaschema specifications
- Community-defined style guidelines
- Integration testing requirements

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager
- OSCAL CLI tool
- Java 11 or higher

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/oscal-test-harness.git
cd oscal-test-harness
```

2. Clone the OSCAL repository (required for metaschemas):
```bash
git clone https://github.com/usnistgov/OSCAL.git
cd OSCAL
git checkout main
cd ..
```

3. Install dependencies:
```bash
npm install
```

4. Configure the environment:
```bash
make configure
```

## Usage

### Local Testing

The test harness provides several npm scripts for different testing scenarios:

#### Run all tests
```bash
npm test
```

#### Run only failed tests
```bash
npm run test:failed
```

#### Run style validation tests
```bash
npm run test:style
```

#### Run integration tests
```bash
npm run test:integration
```

### GitHub Actions Testing

The project includes a manual workflow for running integration tests with custom OSCAL configurations:

1. Go to the "Actions" tab in your GitHub repository
2. Select "OSCAL Validations: Integration tests" workflow
3. Click "Run workflow"
4. Configure the test parameters:
   - **CLI Version**: Version of the OSCAL CLI to use (default: 2.4.0)
   - **Repository**: GitHub repository in format 'owner/repo' (default: usnistgov/OSCAL)
   - **Branch**: Branch to test against (default: main)

Example workflow parameters:
- CLI Version: `2.5.0.SNAPSHOT`
- Repository: `usnistgov/OSCAL`
- Branch: `main`

This will test using the specified repository and branch with CLI version `2.5.0.SNAPSHOT`.
5. Click "Run workflow" to start the tests

This allows testing against different OSCAL CLI versions and repository branches without modifying the code.

## Features

### OSCAL Content Validation
- Validates OSCAL XML content against official metaschemas
- Supports various OSCAL model types:
  - System Security Plans (SSP)
  - Plans of Action and Milestones (POA&M)
  - Component Definitions
  - Assessment Plans
  - Assessment Results

### Style Checking
- Enforces community-defined style guidelines
- Validates XML formatting and structure
- Ensures consistent documentation practices

### SARIF Output
- Generates standardized Static Analysis Results Interchange Format (SARIF) output
- Provides detailed validation results and error reporting
- Enables integration with various development tools and CI/CD pipelines

## Project Structure

```
oscal-test-harness/
├── features/              # Cucumber feature files
│   ├── oscal.feature     # OSCAL validation tests
│   ├── style.feature     # Style validation tests
│   └── sarif.feature     # SARIF output tests
├── style/                # Style guidelines
└── valid-content/        # Test data directory
```

## Contributing

This is a community-run project and contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Please ensure your contributions:
- Include appropriate test coverage
- Follow the existing code style
- Update documentation as needed
- Pass all existing tests

## License

[Add appropriate license information]

## Related Projects

- [OSCAL](https://pages.nist.gov/OSCAL/) - Official NIST OSCAL Documentation
- [OSCAL Content](https://github.com/usnistgov/oscal-content) - Official OSCAL Content Repository
