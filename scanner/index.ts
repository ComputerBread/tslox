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
            case ')':
                return this.addToken(TokenType.RIGHT_PAREN, char);
            case '{':
                return this.addToken(TokenType.LEFT_BRACE, char);
            case '}':
                return this.addToken(TokenType.RIGHT_BRACE, char);
            case ',':
                return this.addToken(TokenType.COMMA, char);
            case '.':
                return this.addToken(TokenType.DOT, char);
            case '-':
                return this.addToken(TokenType.MINUS, char);
            case '+':
                return this.addToken(TokenType.PLUS, char);
            case ';':
                return this.addToken(TokenType.SEMICOLON, char);
            case '/':
                return this.addToken(TokenType.SLASH, char);
            case '*':
                return new Token(TokenType.STAR, char, null, this.line);

            /*
            case '':
                return new Token(TokenType., char, null, this.line);
            */

            // multicharaters
        }
    }

    advance() {
        return this.src.charAt(this.current++);
    }

    addToken(type: TokenType, lexeme: string) {
        this.tokens.push(new Token(type, lexeme, null, this.line));
    }

}