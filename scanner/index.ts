import { TsLoxUtils } from "../tslox";
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

            case ';':
                this.addToken(TokenType.SEMICOLON);
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
            case '-':
                if (this.match("-")) this.addToken(TokenType.MINUS_MINUS);
                else if (this.match("=")) this.addToken(TokenType.MINUS_EQUAL);
                else this.addToken(TokenType.MINUS);
                break;
            case '+':
                if (this.match("+")) this.addToken(TokenType.PLUS_PLUS);
                else if (this.match("=")) this.addToken(TokenType.PLUS_EQUAL);
                else this.addToken(TokenType.PLUS);
                break;
            case '!':
                if (this.match('=')) {
                    this.addToken(TokenType.BANG_EQUAL);
                } else {
                    this.addToken(TokenType.BANG);
                }
                break;
            case '=':
                this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
                break;
            case '<':
                this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
                break;
            case '>':
                this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
                break;
            case '/':
                if (this.match('/')) { // single line comment
                    while (this.peek() != '\n' && !this.isAtEnd()) {
                        this.advance();
                    }
                } else if (this.match('*')) {
                    const startingLine = this.line;
                    while (this.peek() != '*' && this.peekNext() != '/' && !this.isAtEnd()) {
                        this.advance();
                    }

                    if (this.isAtEnd()) {
                        TsLoxUtils.simpleError(startingLine, "You forgot to end your comment bozo");
                    }

                    this.advance(); // removes '*'
                    this.advance(); // removes '/'
                } else {
                    this.addToken(TokenType.SLASH);
                }
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

    peek() {
        if (this.isAtEnd()) return '\0';
        return this.src.charAt(this.current);
    }

    peekNext() {
        let nextPos = this.current + 1;
        if (nextPos >= this.src.length) return '\0';
        return this.src.charAt(this.current + 1);
    }


}