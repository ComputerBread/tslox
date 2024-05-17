import type { Token } from "./scanner/Token";
import { TokenType } from "./scanner/TokenType";

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
  // 2. parse

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
  }
}