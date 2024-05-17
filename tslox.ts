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
