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
    current: number = 0; // current position in the src code
    line: number = 1; // current line number in src code
    src: string; // source code
    start: number = 0;

    constructor(src: string) {
        this.src = src;
    }

    isAtEnd() {
        return this.current >= this.src.length;
    }

    scan() {
        while (!this.isAtEnd()) {
            this.start = this.current;
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
                this.addToken(TokenType.LEFT_PAREN);
                break;
            case ')':
                this.addToken(TokenType.RIGHT_PAREN);
                break;
            case '{':
                this.addToken(TokenType.LEFT_BRACE);
                break;
            case '}':
                this.addToken(TokenType.RIGHT_BRACE);
                break;
            case ',':
                this.addToken(TokenType.COMMA);
                break;
            case '.':
                this.addToken(TokenType.DOT);
                break;
            case '-':
                this.addToken(TokenType.MINUS);
                break;
            case '+':
                this.addToken(TokenType.PLUS);
                break;
            case ';':
                this.addToken(TokenType.SEMICOLON);
                break;
            case '/':
                this.addToken(TokenType.SLASH);
                break;
            case '*':
                this.addToken(TokenType.STAR);
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
                if (this.match('=')) {
                    this.addToken(TokenType.BANG_EQUAL);
                } else {
                    this.addToken(TokenType.BANG);
                }
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

    addToken(type: TokenType) {
        const lexeme = this.src.slice(this.start, this.current);
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