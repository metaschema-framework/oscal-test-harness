import { Given, Then, When } from "@cucumber/cucumber";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { formatSarifOutput, validateDocument } from "oscal";
import { join } from "path";
import { Log, Result, Run } from 'sarif';

const sarifDir = join(process.cwd(), "sarif");
const style="style/oscal_style_guide.xml"
const quiet = process.env.OSCAL_QUIET === 'true' ? true : false;
const executor = process.env.OSCAL_EXECUTOR === 'oscal-cli' ? 'oscal-cli' : 'oscal-server';

if (!existsSync(sarifDir)) {
  mkdirSync(sarifDir, { recursive: true });
}

interface LogOptions {
  showFileName: boolean;
}

Given('the OSCAL CLI tool is installed', function() {
  // Using the package directly now, no need to check CLI installation
  return;
});

Given('the metaschema directory is {string}', function(dir) {
  this.metaschemaDir = dir;
});

const VALIDATION_TIMEOUT = 90000;

When('I validate {string} metaschema it passes style guide',{timeout: VALIDATION_TIMEOUT}, async function(type) {
  const metaschema = 'oscal_'+type+'_metaschema.xml';
  const metaschemaPath = `${this.metaschemaDir}/${metaschema}`;
  const sarifOutputPath = join(sarifDir, `${type}.sarif.json`);  
  try {
    const {log} = await validateDocument(metaschemaPath,{extensions:[style],flags:[],quiet,module:"http://csrc.nist.gov/ns/oscal/metaschema/1.0"},executor);
    this.sarifOutput=log;
    writeFileSync(sarifOutputPath, JSON.stringify(log, null, 2));
  } catch (error) {
    console.error('Validation failed:', error);
    throw error;
  }
});

When('I validate OSCAL content in {string}',{timeout:90000}, async function(contentPath) {
  const complete_metaschema = 'oscal_complete_metaschema.xml';
  const module = `${this.metaschemaDir}/${complete_metaschema}`;

  const {isValid,log} = await validateDocument(contentPath,{extensions:[],flags:[],quiet,module},executor);
    const sarifOutputPath = join(sarifDir, `${contentPath.replaceAll("/","_")}.sarif.json`);
    writeFileSync(sarifOutputPath, JSON.stringify(log, null, 2));
    const formattedOutput = formatSarifOutput(log);
    console.log(formattedOutput);
    
    this.sarifOutput = log; // Set the global this.sarifOutput variable
    
    this.result = { 
      isValid,
      sarifLog: log,
      formattedOutput
    };
  
});

Then('Sarif output should contain passing rules', function() {
  if (this.sarifOutput===null) {
    throw new Error('Missing SARIF log');
  }

  const passingRules = this.sarifOutput.runs.flatMap((x:Run)=>x.results).filter((result:any) => result.kind === 'pass');
  
  if (passingRules.length === 0) {
    throw new Error(`No passing rules found!\n\nFull SARIF Output:\n${formatSarifOutput(this.sarifOutput)}`);
  }
});

Then('Sarif output should not contain failing rules', function() {
  if (this.sarifOutput===null) {
    throw new Error('Missing SARIF log');
  }

  const failingRules = this.sarifOutput.runs.flatMap((x:Run)=>x.results).filter((result:any) => result.kind === 'fail');
  
  if (failingRules.length > 0) {
    throw new Error(`Found ${failingRules.length} failing results!\n\nFull SARIF Output:\n${formatSarifOutput(this.sarifOutput)}`);
  }
});
