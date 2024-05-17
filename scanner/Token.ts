import { TokenType } from "./TokenType";

export class Token {
    type: TokenType;
    lexeme: string; // contain the raw string of the lexeme
    literal: any; // for literals, contains its value. (we could merge lexeme & value)
    line: number; // use for debugging purposes

    constructor(type: TokenType, lexeme: string, literal: any, line: number) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }

    toString(): string {
        return this.type.toString() + " " + this.lexeme + " " + this.literal;
    }

}