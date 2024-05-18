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
export class Scanner {

    tokens: Token[] = [];
    current: number = 0; // current position in the src code
    line: number = 1; // current line number in src code
    src: string; // source code
    start: number = 0;

    keywords: Map<string, TokenType> = new Map<string, TokenType>([
        ["and", TokenType.AND],
        ["else", TokenType.ELSE],
        ["false", TokenType.FALSE],
        ["for", TokenType.FOR],
        ["fun", TokenType.FUN],
        ["if", TokenType.IF],
        ["nil", TokenType.NIL],
        ["or", TokenType.OR],
        ["print", TokenType.PRINT],
        ["return", TokenType.RETURN],
        ["true", TokenType.TRUE],
        ["var", TokenType.VAR],
        ["while", TokenType.WHILE],
    ]);

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
                        break;
                    }

                    this.advance(); // removes '*'
                    this.advance(); // removes '/'
                } else {
                    this.addToken(TokenType.SLASH);
                }
                break;

            case '"': // string
                while (this.peek() != '"' && !this.isAtEnd()) {
                    if (this.peek() == '\n') this.line++;
                    this.advance();
                }
                if (this.isAtEnd()) {
                    TsLoxUtils.simpleError(this.line, "You forgot to end your comment bozo");
                    break;
                }
                this.advance() // remove closing '"'

                const value = this.src.slice(this.start + 1, this.current - 1);
                this.addTokenWithValue(TokenType.STRING, value);

                break;

            default: // number, identifier, keywords
                if (this.isDigit(char)) {
                    this.number();
                } else if (this.isAlpha(char)) {
                    this.identifier();
                } else {
                    TsLoxUtils.simpleError(this.line, "Unexpected character.");
                }
                break;
        }
    }

    advance() {
        return this.src.charAt(this.current++);
    }

    addToken(type: TokenType) {
        this.addTokenWithValue(type, null);
    }

    addTokenWithValue(type: TokenType, literal: any) {
        const lexeme = this.src.slice(this.start, this.current);
        this.tokens.push(new Token(type, lexeme, literal, this.line));
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
        if (this.isAtEnd()) return '\0'; // useful, to avoid having to type isAtEnd() in some while loops
        return this.src.charAt(this.current);
    }

    peekNext() {
        let nextPos = this.current + 1;
        if (nextPos >= this.src.length) return '\0';
        return this.src.charAt(this.current + 1);
    }

    isDigit(c: string) {
        return c >= '0' && c <= '9';
    }

    number() {
        while (this.isDigit(this.peek())) { // we don't need  `&& !this.isAtEnd()` peek() will return someting that is not a number
            this.advance();
        }

        if (this.peek() === '.') { // jlox has "isDigit(peekNext())" is it really necessary?
            do this.advance();
            while (this.isDigit(this.peek()));
        }

        const nb = Number(this.src.slice(this.start, this.current));
        this.addTokenWithValue(TokenType.NUMBER, nb);
    }

    isAlpha(c: string) {
        return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || c === '_';
    }

    isAlphaNum(c: string) {
        return this.isAlpha(c) || this.isDigit(c);
    }

    identifier() {
        while (this.isAlphaNum(this.peek())) {
            this.advance();
        }

        // check if it's a keyword
        const text = this.src.slice(this.start, this.current);
        let type = this.keywords.get(text) ?? TokenType.IDENTIFIER;

        this.addToken(type);
    }

}