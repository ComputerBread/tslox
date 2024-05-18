# tslox

TypeScript version of jlox (- classes + bunch of things).

I am learning to create prog. lang. by reading [crafting interpreters](https://craftinginterpreters.com).
I've done the java implementation of Lox (jlox), before moving to clox,
I want to make sure I understood everything and can extends or remove elemnts,
by doing a TypeScript version of Lox. It's not going to be 1-to-1, but it should
be pretty similar.

so goals of this:

- apply my newly acquired knowledge
- make sure I understood everything
- identify what I didn't understand, and what I need to work on
- prepare an upcoming video

## D grammar

[original grammar](https://craftinginterpreters.com/appendix-i.html#lexical-grammar)

D grammar, modified

```
program     -> declaration* EOF ;
declaration -> funDecl | varDecl | statement ;
funDecl     -> "fun" function ;
function    -> IDENTIFIER "(" parameters? ")" block ;
parameters  -> IDENTIFIER ( "," IDENTIFIER)* ;
statement   -> exprStmt | forStmt | ifStmt | printStmt | returnStmt | whileStmt | block;
exprStmt    -> expression ";" ;
forStmt     -> "for" "(" ( varDecl | exprStmt | ";" ) expression? ";" expression? ")" statement;
ifStmt      -> "if" "(" expression ")" statement ( "else" statement )? ;
printStmt   -> "print" expression ";" ;
returnStmt  -> "return" expression? ";" ;
whileStmt   -> "while" "(" expression ")" statement ;
block       -> "{" declaration* "}" ;
varDecl     -> "var" IDENTIFIER ( "=" expression )? ";" ;
expression  -> assignment ;
assignment  -> IDENTIFIER "=" assignment | IDENTIFIER "+=" assignment | IDENTIFIER "-=" assignment | logic_or ;
logic_or    -> logic_and ( "or" logic_and )* ;
logic_and   -> equality ( "and" equality )* ;
equality    -> comparison (( "!=" | "==") comparison)* ;
comparison  -> term (("<" | ">" | "<=" | ">=") term)* ;
term        -> factor (("-" | "+") factor)*;
factor      -> unary (("/" | "*") unary)*;
unary       -> ("!" | "-" | "++" | "--") unary | postfix | call;
postfix     -> primary ("++" | "--");
call        -> primary ( "(" arguments? ")" | "." IDENTIFIER )* ;
arguments   -> expression ( "," expression )*;
primary     -> NUMBER | STRING | "true" | "false" | "nil" | "(" expression ")" | IDENTIFIER | "super" "." IDENTIFIER;

++IDENTIFIER | --IDENTIFIER | IDENTIFIER++ | IDENTIFIER--
```

## stuff

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run jslox.ts
```

This project was created using `bun init` in bun v1.1.8. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
