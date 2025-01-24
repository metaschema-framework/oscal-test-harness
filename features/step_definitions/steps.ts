import { Given, Then, When } from "@cucumber/cucumber";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { formatSarifOutput, validateDocument } from "oscal";
import { ExecutorOptions } from "oscal/dist/utils";
import { join } from "path";
import { Log, Result, Run } from 'sarif';

const sarifDir = join(process.cwd(), "sarif");
const style = process.env.OSCAL_STYLE_GUIDE || "./style/oscal_style_guide.xml"
const quiet = process.env.OSCAL_QUIET === 'true'
const executor:ExecutorOptions = process.env.OSCAL_EXECUTOR as ExecutorOptions || 'oscal-cli';

if (!existsSync(sarifDir)) {
  try {
    mkdirSync(sarifDir, { recursive: true });
  } catch (error) {
    console.error(`Failed to create directory ${sarifDir}:`, error);
    throw error;
  }
}

interface LogOptions {
  showFileName: boolean;
}


Given('the metaschema directory is {string}', function(dir) {
  this.metaschemaDir = dir;
});

const VALIDATION_TIMEOUT = 90000;

When('I validate {string} metaschema it passes style guide',{timeout: VALIDATION_TIMEOUT}, async function(type) {
  const metaschema = 'oscal_'+type+'_metaschema.xml';
  const metaschemaPath = `${this.metaschemaDir}/${metaschema}`;
  const sarifOutputPath = join(sarifDir, `${type}.sarif.json`);  

  console.log(`Validating metaschema with:
    - Metaschema path: ${metaschemaPath}
    - Style guide: ${style}
    - Executor: ${JSON.stringify(executor)}
    - Quiet mode: ${quiet}`);

  try {
    // First check if files exist
    if (!existsSync(metaschemaPath)) {
      throw new Error(`Metaschema not found at path: ${metaschemaPath}`);
    }
    if (!existsSync(style)) {
      throw new Error(`Style guide not found at path: ${style}`);
    }

    console.log('Starting metaschema validation...');
    const {log,isValid} = await validateDocument(metaschemaPath, {
      extensions: [style],
      flags: ['disable-schema'], // Focus on style validation
      quiet,
      module: "http://csrc.nist.gov/ns/oscal/metaschema/1.0"
    }, executor);

    console.log(`Validation completed:
      - Is valid: ${isValid}`);
    console.log('Results:', 
      (log.runs?.[0]?.results ?? [])
        .reduce((acc:Record<string,number>, r:Result) => {
          acc[r.kind||"unknown"] = (acc[r.kind||"unknown"] || 0) + 1;
          return acc;
        }, {})
    );    // Log the full SARIF output for debugging
    console.log(formatSarifOutput(log));

    this.sarifOutput = log;
    writeFileSync(sarifOutputPath, JSON.stringify(log, null, 2));
  } catch (error) {
    console.error('Metaschema validation failed:', error);
    console.error('Error details:', error instanceof Error ? error.stack : error);
    throw error;
  }
});

When('I validate OSCAL content in {string}',{timeout: VALIDATION_TIMEOUT}, async function(contentPath) {
  const complete_metaschema = 'oscal_complete_metaschema.xml';
  const module = `${this.metaschemaDir}/${complete_metaschema}`;

  console.log(`Validating content with:
    - Content path: ${contentPath}
    - Module: ${module}
    - Executor: ${JSON.stringify(executor)}
    - Quiet mode: ${quiet}`);

  try {
    // First check if module exists
    if (!existsSync(module)) {
      throw new Error(`Metaschema module not found at path: ${module}`);
    }

    console.log('Starting document validation...');
    const {isValid, log} = await validateDocument(contentPath, {
      extensions: [],
      flags: ['disable-schema'], // Allow schema validation to be handled by the CLI
      quiet,
      module
    }, executor);

    console.log(`Validation completed:
      - Is valid: ${isValid}`);
    console.log('Results:', 
      (log.runs?.[0]?.results ?? [])
        .reduce((acc:Record<string,number>, r:Result) => {
          acc[r.kind||"unknown"] = (acc[r.kind||"unknown"] || 0) + 1;
          return acc;
        }, {})
    );
    const sarifOutputPath = join(sarifDir, `${contentPath.replaceAll("/","_")}.sarif.json`);
    writeFileSync(sarifOutputPath, JSON.stringify(log, null, 2));
    
    // Log the full SARIF output for debugging
    console.log(formatSarifOutput(log));
    
    const formattedOutput = formatSarifOutput(log);
    console.log('Formatted output:', formattedOutput);
    
    this.sarifOutput = log;
    
    this.result = { 
      isValid,
      sarifLog: log,
      formattedOutput
    };
  } catch (error) {
    console.error('Content validation failed:', error);
    console.error('Error details:', error instanceof Error ? error.stack : error);
    throw error;
  }
});

Then('Sarif output should contain passing rules', function() {
  if (this.sarifOutput===null) {
    throw new Error('Missing SARIF log');
  }

  const passingRules = this.sarifOutput.runs.flatMap((x:Run)=>x.results).filter((result:Result) => result.kind === 'pass');
  
  if (passingRules.length === 0) {
    throw new Error(`No passing rules found!\n\nFull SARIF Output:\n${formatSarifOutput(this.sarifOutput)}`);
  }
});

Then('Sarif output should not contain failing rules', function() {
  if (this.sarifOutput===null) {
    throw new Error('Missing SARIF log');
  }

  const failingRules = this.sarifOutput.runs.flatMap((x:Run)=>x.results).filter((result:Result) => result.kind === 'fail');
  
  if (failingRules.length > 0) {
    throw new Error(`Found ${failingRules.length} failing results!\n\nFull SARIF Output:\n${formatSarifOutput(this.sarifOutput)}`);
  }
});
