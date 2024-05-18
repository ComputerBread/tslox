import { Scanner } from "./Scanner";
import type { Token } from "./Scanner/Token";
import { TokenType } from "./Scanner/TokenType";

let hadError = false;

function main() {
  runPrompt();
}

async function runPrompt() {

  const prompt = "jslox> ";
  process.stdout.write(prompt);
  for await (const line of console) {
    run(line);
    process.stdout.write(prompt);
  }

}

function run(code: string) {

  // 1. scan
  const scanner = new Scanner(code);
  scanner.scan();
  console.log(scanner.tokens);

  // 2. parse

  // sntax error
  if (hadError) return;

  // check syntax error

  // 3. interpret

}

main();



// -----------------------------------------------------
// Utility functions
export class TsLoxUtils {

  static simpleError(line: number, message: string) {
    this.report(line, "", message);
  }

  static error(token: Token, message: string) {
    if (token.type === TokenType.EOF) {
      this.report(token.line, " at end", message);
    } else {
      this.report(token.line, " at '" + token.lexeme + "'", message);
    }
  }

  static report(line: number, where: string, message: string) {
    console.error(`[line #${line}] Error ${where}: ${message}`);
    hadError = true;
  }
}