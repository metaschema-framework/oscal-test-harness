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

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/oscal-test-harness.git
cd oscal-test-harness
```

2. Install dependencies:
```bash
npm install
```

## Usage

The test harness provides several npm scripts for different testing scenarios:

### Run all tests
```bash
npm test
```

### Run only failed tests
```bash
npm run test:failed
```

### Run style validation tests
```bash
npm run test:style
```

### Run integration tests
```bash
npm run test:integration
```

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
