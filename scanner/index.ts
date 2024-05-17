import { Token } from "./Token";
import { TokenType } from "./TokenType";

/**
 * Lexical grammar: <https://craftinginterpreters.com/appendix-i.html#lexical-grammar>
 * 
 * NUMBER -> DIGIT+ ("." DIGIT+ )?;
 * STRING -> "\"" <any character except "\"">* "\"";
 * IDENTIFIER -> ALPHA ( ALPHA | DIGIT)*;
 * ALPHA -> "a" ... "z" | "A" ... "Z" | "_";
 * DIGIT -> "0" ... "9";
 */
class Scanner {

    tokens: Token[] = [];
    current = 0; // current position in the src code
    line = 1; // current line number in src code
    src: string; // source code

    constructor(src: string) {
        this.src = src;
    }

    isAtEnd() {
        return this.current >= this.src.length;
    }

    scan() {
        while (!this.isAtEnd()) {
            this.scanToken();
        }
        this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
        // todo add EOF token
    }

    scanToken() {
        let char = this.advance();

        switch (char) {
            // single character
            case '(':
                this.addToken(TokenType.LEFT_PAREN, char);
                break;
            case ')':
                this.addToken(TokenType.RIGHT_PAREN, char);
                break;
            case '{':
                this.addToken(TokenType.LEFT_BRACE, char);
                break;
            case '}':
                this.addToken(TokenType.RIGHT_BRACE, char);
                break;
            case ',':
                this.addToken(TokenType.COMMA, char);
                break;
            case '.':
                this.addToken(TokenType.DOT, char);
                break;
            case '-':
                this.addToken(TokenType.MINUS, char);
                break;
            case '+':
                this.addToken(TokenType.PLUS, char);
                break;
            case ';':
                this.addToken(TokenType.SEMICOLON, char);
                break;
            case '/':
                this.addToken(TokenType.SLASH, char);
                break;
            case '*':
                this.addToken(TokenType.STAR, char);
                break;

            // we ignore whitespace
            case ' ':
            case '\t':
            case '\r':
                break;

            // for newlines we need to increment the line number
            case '\n':
                this.line++;
                break;

            // multicharaters

            // one or two characters
            case '!':
                break;
            case '=':
                break;
            case '<':
                break;
            case '>':
                break;
            case '/':
                break;
        }
    }

    advance() {
        return this.src.charAt(this.current++);
    }

    addToken(type: TokenType, lexeme: string) {
        this.tokens.push(new Token(type, lexeme, null, this.line));
    }

    /* Check if the next character (at position current) matches "expect"
       if it matches it advances.
    */
    match(expect: string) {
        if (this.isAtEnd()) return false;

        if (expect !== this.src.charAt(this.current)) {
            return false;
        }

        this.current++;
        return true;
    }

}