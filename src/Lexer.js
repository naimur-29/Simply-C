console.log("lexer.js connected!");
class Lexer {
  constructor(sourceCode) {
    this.sourceCode = sourceCode;
    this.src = [];
    this.tokens = [];
    this.current = "";
    this.keywords = types.KEYWORDS;
    this.tokenTypes = types.TOKEN_TYPES;
    this.commentFound = false;
  }

  tokenize() {
    this.src = this.sourceCode.split("");
    DFA.recognize(this);
  }

  advance() {
    if (this.src.length <= 0) {
      this.current = null;
      return null;
    }
    this.current = this.src.shift();
    return this.current;
  }

  retract() {
    this.src.unshift(this.current);
  }

  addToken(type, val) {
    const token = new Token(type, val);
    this.tokens.push(token);
  }

  error(type, val) {
    this.addToken(this.tokenTypes.ERROR[type], val);
    console.log(`Error: ${type} at (${val})`);
  }

  srcEmpty() {
    return this.src.length <= 0;
  }

  isAlphabet() {
    return this.current.toLowerCase() !== this.current.toUpperCase();
  }

  isDigit() {
    const lowerBound = "0".charCodeAt();
    const upperBound = "9".charCodeAt();
    const charCode = this.current.charCodeAt();

    return charCode >= lowerBound && charCode <= upperBound;
  }

  canBeNumber() {
    return this.isDigit() || this.current === ".";
  }

  isAssignOrCompareOp() {
    return this.current === "=" || this.current === ">" || this.current === "<";
  }

  isLogicalOp() {
    return this.current === "&" || this.current === "|" || this.current === "!";
  }

  isBinaryOp() {
    return (
      this.current === "+" ||
      this.current === "-" ||
      this.current === "*" ||
      this.current === "/" ||
      this.current === "%"
    );
  }

  isIgnorable() {
    return (
      this.current === " " ||
      this.current === "\n" ||
      this.current === "\t" ||
      this.current === "\0"
    );
  }

  isIdentifierChar() {
    return this.current === "_";
  }

  display(element) {
    let tokensInfo = [];
    for (const token of this.tokens) tokensInfo.push(token.getInfo());
    element.value = tokensInfo.join("\n");
  }
}

class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  getInfo() {
    return `<${this.type}, '${this.value}'>`;
  }
}
