console.log("DFA.js connected!");
const recognizeComment = (lexer) => {
  lexer.retract();
  let val = "";
  let state = 0;

  while (true) {
    switch (state) {
      case 0:
        lexer.advance();
        if (lexer.current === "\n" || lexer.current === "\0") state = 1;
        else val += lexer.current;
        break;
      case 1:
        lexer.tokens[lexer.tokens.length - 1].value = val;
        lexer.commentFound = false;
        return true;
    }
  }
};

const recognizeAssignOrCompareOperator = (lexer) => {
  lexer.retract();
  let val = "";
  let state = 0;

  const changeState = (a, b) => {
    if (lexer.current === "=") {
      state = a;
      val += lexer.current;
    } else state = b;
  };

  while (true) {
    switch (state) {
      case 0:
        lexer.advance();
        if (lexer.current === "=") state = 1;
        else if (lexer.current === ">") state = 4;
        else if (lexer.current === "<") state = 7;
        else return false;
        val += lexer.current;
        break;
      case 1:
        lexer.advance();
        changeState(2, 3);
        break;
      case 2:
        lexer.addToken(lexer.tokenTypes.COMPARE_OPERATOR.EQUAL, val);
        return true;
      case 3:
        lexer.addToken(lexer.tokenTypes.ASSIGN_OPERATOR.ASSIGN, val);
        if (lexer.srcEmpty()) return true;
        lexer.retract();
        return true;
      case 4:
        lexer.advance();
        changeState(5, 6);
        break;
      case 5:
        lexer.addToken(lexer.tokenTypes.COMPARE_OPERATOR.GREATER_EQUAL, val);
        return true;
      case 6:
        lexer.addToken(lexer.tokenTypes.COMPARE_OPERATOR.GREATER, val);
        if (lexer.srcEmpty()) return true;
        lexer.retract();
        return true;
      case 7:
        lexer.advance();
        changeState(8, 9);
        break;
      case 8:
        lexer.addToken(lexer.tokenTypes.COMPARE_OPERATOR.LESS_EQUAL, val);
        return true;
      case 9:
        lexer.addToken(lexer.tokenTypes.COMPARE_OPERATOR.LESS, val);
        if (lexer.srcEmpty()) return true;
        lexer.retract();
        return true;
    }
  }
};

const recognizeLogicalOperator = (lexer) => {
  lexer.retract();
  let val = "";
  let state = 0;

  const changeState = (symbol, a, b) => {
    if (lexer.current === symbol) {
      state = a;
      val += lexer.current;
    } else state = b;
  };

  while (true) {
    switch (state) {
      case 0:
        lexer.advance();
        if (lexer.current === "!") state = 1;
        else if (lexer.current === "&") state = 2;
        else if (lexer.current === "|") state = 5;
        else return false;
        val += lexer.current;
        break;
      case 1:
        lexer.addToken(lexer.tokenTypes.LOGICAL_OPERATOR.NOT, val);
        return true;
      case 2:
        lexer.advance();
        changeState("&", 3, 4);
        break;
      case 3:
        lexer.addToken(lexer.tokenTypes.LOGICAL_OPERATOR.AND, val);
        return true;
      case 4:
        lexer.addToken(lexer.tokenTypes.LOGICAL_OPERATOR.LOGICAL_AND, val);
        if (lexer.srcEmpty()) return true;
        lexer.retract();
        return true;
      case 5:
        lexer.advance();
        changeState("|", 6, 7);
        break;
      case 6:
        lexer.addToken(lexer.tokenTypes.LOGICAL_OPERATOR.OR, val);
        return true;
      case 7:
        lexer.addToken(lexer.tokenTypes.LOGICAL_OPERATOR.PIPE, val);
        if (lexer.srcEmpty()) return true;
        lexer.retract();
        return true;
    }
  }
};

const recognizeBinaryAndAssignOperator = (lexer) => {
  lexer.retract();
  let val = "";
  let state = 0;

  const changeState = (sym1, sym2, a, b, c) => {
    if (sym1 !== null && lexer.current === sym1) {
      state = a;
      val += lexer.current;
    } else if (sym2 !== null && lexer.current === sym2) {
      state = b;
      val += lexer.current;
    } else state = c;
  };

  while (true) {
    switch (state) {
      case 0:
        lexer.advance();
        if (lexer.current === "+") state = 1;
        else if (lexer.current === "-") state = 5;
        else if (lexer.current === "*") state = 9;
        else if (lexer.current === "/") state = 13;
        else if (lexer.current === "%") state = 17;
        else return false;
        val += lexer.current;
        break;
      case 1:
        lexer.advance();
        changeState("+", "=", 2, 3, 4);
        break;
      case 2:
        lexer.addToken(lexer.tokenTypes.BINARY_OPERATOR.INCREMENT, val);
        return true;
      case 3:
        lexer.addToken(lexer.tokenTypes.ASSIGN_OPERATOR.ADDITION_ASSIGN, val);
        return true;
      case 4:
        lexer.addToken(lexer.tokenTypes.BINARY_OPERATOR.ADDITION, val);
        if (lexer.srcEmpty()) return true;
        lexer.retract();
        return true;
      case 5:
        lexer.advance();
        changeState("-", "=", 6, 7, 8);
        break;
      case 6:
        lexer.addToken(lexer.tokenTypes.BINARY_OPERATOR.DECREMENT, val);
        return true;
      case 7:
        lexer.addToken(
          lexer.tokenTypes.ASSIGN_OPERATOR.SUBTRACTION_ASSIGN,
          val
        );
        return true;
      case 8:
        lexer.addToken(lexer.tokenTypes.BINARY_OPERATOR.SUBTRACTION, val);
        if (lexer.srcEmpty()) return true;
        lexer.retract();
        return true;
      case 9:
        lexer.advance();
        changeState("*", "=", 10, 11, 12);
        break;
      case 10:
        lexer.addToken(lexer.tokenTypes.BINARY_OPERATOR.POWER, val);
        return true;
      case 11:
        lexer.addToken(
          lexer.tokenTypes.ASSIGN_OPERATOR.MULTIPLICATION_ASSIGN,
          val
        );
        return true;
      case 12:
        lexer.addToken(lexer.tokenTypes.BINARY_OPERATOR.MULTIPLICATION, val);
        if (lexer.srcEmpty()) return true;
        lexer.retract();
        return true;
      case 13:
        lexer.advance();
        changeState("/", "=", 14, 15, 16);
        break;
      case 14:
        lexer.addToken(lexer.tokenTypes.COMMENT, val);
        lexer.commentFound = true;
        return true;
      case 15:
        lexer.addToken(lexer.tokenTypes.ASSIGN_OPERATOR.DIVISION_ASSIGN, val);
        return true;
      case 16:
        lexer.addToken(lexer.tokenTypes.BINARY_OPERATOR.DIVISION, val);
        if (lexer.srcEmpty()) return true;
        lexer.retract();
        return true;
      case 17:
        lexer.advance();
        changeState(null, "=", null, 18, 19);
        break;
      case 18:
        lexer.addToken(lexer.tokenTypes.ASSIGN_OPERATOR.REMAINDER_ASSIGN, val);
        return true;
      case 19:
        lexer.addToken(lexer.tokenTypes.BINARY_OPERATOR.REMAINDER, val);
        if (lexer.srcEmpty()) return true;
        lexer.retract();
        return true;
    }
  }
};

const recognizeNumber = (lexer) => {
  lexer.retract();
  let val = "";
  let state = 0;

  const checkLimit = (type, value) => {
    if (val.length > 10) {
      lexer.error("NUMBER_OUT_OF_RANGE", val);
      return false;
    } else lexer.addToken(type, value);
  };

  while (true) {
    switch (state) {
      case 0:
        lexer.advance();
        if (lexer.isDigit()) state = 1;
        else if (lexer.current === ".") state = 12;
        else return false;
        val += lexer.current;
        break;
      case 1:
        lexer.advance();
        if (lexer.isDigit()) {
          val += lexer.current;
        } else if (lexer.current === ".") {
          state = 3;
          val += lexer.current;
        } else if (lexer.current === "E") {
          state = 5;
          val += lexer.current;
        } else state = 2;
        break;
      case 2:
        checkLimit(lexer.tokenTypes.NUMBER, val);
        if (lexer.srcEmpty()) return true;
        lexer.retract();
        return true;
      case 3:
        lexer.advance();
        if (lexer.isDigit()) {
          val += lexer.current;
        } else if (lexer.current === "E") {
          state = 5;
          val += lexer.current;
        } else state = 4;
        break;
      case 4:
        checkLimit(lexer.tokenTypes.NUMBER, val);
        if (lexer.srcEmpty()) return true;
        lexer.retract();
        return true;
      case 5:
        lexer.advance();
        if (lexer.isDigit()) {
          state = 7;
          val += lexer.current;
        } else if (lexer.current === "+" || lexer.current === "-") {
          state = 9;
          val += lexer.current;
        } else state = 6;
        break;
      case 6:
        lexer.retract();
        lexer.src.unshift(val[val.length - 1]);
        val = val.slice(0, val.length - 1);
        checkLimit(lexer.tokenTypes.NUMBER, val);
        return true;
      case 7:
        lexer.advance();
        if (lexer.isDigit()) {
          val += lexer.current;
        } else state = 8;
        break;
      case 8:
        checkLimit(lexer.tokenTypes.NUMBER, val);
        if (lexer.srcEmpty()) return true;
        lexer.retract();
        return true;
      case 9:
        lexer.advance();
        if (lexer.isDigit()) {
          state = 10;
          val += lexer.current;
        } else state = 11;
        break;
      case 10:
        lexer.advance();
        if (lexer.isDigit()) val += lexer.current;
        else state = 8;
        break;
      case 11:
        lexer.retract();
        lexer.src.unshift(val[val.length - 1]);
        lexer.src.unshift(val[val.length - 2]);
        val = val.slice(0, val.length - 2);
        checkLimit(lexer.tokenTypes.NUMBER, val);
        return true;
      case 12:
        lexer.advance();
        if (lexer.isDigit()) {
          state = 3;
          val += lexer.current;
        } else state = 13;
        break;
      case 13:
        lexer.retract();
        if (lexer.srcEmpty()) return false;
        lexer.error("UNKNOWN_CHARACTER", ".");
        return false;
    }
  }
};

const recognizeText = (lexer) => {
  lexer.retract();
  let val = "";
  let state = 0;

  while (true) {
    switch (state) {
      case 0:
        lexer.advance();
        if (lexer.current === "'") state = 1;
        else if (lexer.current === '"') state = 3;
        else return false;
        break;
      case 1:
        lexer.advance();
        if (lexer.current === "'") state = 2;
        else val += lexer.current;
        break;
      case 2:
        lexer.addToken(lexer.tokenTypes.TEXT, val);
        return true;
      case 3:
        lexer.advance();
        if (lexer.current === '"') state = 4;
        else val += lexer.current;
        break;
      case 4:
        lexer.addToken(lexer.tokenTypes.TEXT, val);
        return true;
    }
  }
};

const recognizeIdentifierAndKeyword = (lexer) => {
  lexer.retract();
  let val = "";
  let state = 0;

  while (true) {
    switch (state) {
      case 0:
        lexer.advance();
        if (lexer.isAlphabet()) {
          state = 1;
          val += lexer.current;
        } else return false;
        break;
      case 1:
        lexer.advance();
        if (
          lexer.current !== null &&
          (lexer.isAlphabet() || lexer.isDigit() || lexer.isIdentifierChar())
        ) {
          state = 1;
          val += lexer.current;
        } else {
          state = 2;
        }
        break;
      case 2:
        if (DFA.keyword(lexer, val)) {
          const prevToken =
            lexer.tokens.length > 0
              ? lexer.tokens[lexer.tokens.length - 1]
              : null;
          if (
            prevToken !== null &&
            prevToken.type === "keyword" &&
            DFA.keyword(lexer, `${prevToken.value} ${val}`)
          ) {
            lexer.tokens.pop();
            lexer.addToken(
              lexer.tokenTypes.KEYWORD,
              `${prevToken.value} ${val}`
            );
          } else lexer.addToken(lexer.tokenTypes.KEYWORD, val);
        } else {
          if (val === val.toUpperCase())
            lexer.addToken(lexer.tokenTypes.CONSTANT, val);
          else lexer.addToken(lexer.tokenTypes.IDENTIFIER, val);
        }

        if (lexer.srcEmpty()) return true;
        lexer.retract();
        return true;
    }
  }
};

const recognizeKeyword = (lexer, value) => {
  return lexer.keywords.includes(value);
};

/////////////////////////////////
const recognize = (lexer) => {
  while (!lexer.srcEmpty()) {
    lexer.advance();

    if (lexer.commentFound) DFA.comment(lexer);
    else if (lexer.isIgnorable()) continue;
    else if (lexer.isAlphabet()) DFA.identifier(lexer);
    else if (lexer.isAssignOrCompareOp()) DFA.assignOrCompareOp(lexer);
    else if (lexer.isLogicalOp()) DFA.logicalOp(lexer);
    else if (lexer.isBinaryOp()) DFA.binaryOp(lexer);
    else if (lexer.current === '"' || lexer.current === "'") DFA.text(lexer);
    else if (lexer.canBeNumber()) DFA.number(lexer);
    else if (lexer.current === "(")
      lexer.addToken(lexer.tokenTypes.OPEN_PAREN, lexer.current);
    else if (lexer.current === ")")
      lexer.addToken(lexer.tokenTypes.CLOSE_PAREN, lexer.current);
    else if (lexer.current === "{")
      lexer.addToken(lexer.tokenTypes.OPEN_CURLY, lexer.current);
    else if (lexer.current === "}")
      lexer.addToken(lexer.tokenTypes.CLOSE_CURLY, lexer.current);
    else if (lexer.current === "[")
      lexer.addToken(lexer.tokenTypes.OPEN_ROUND, lexer.current);
    else if (lexer.current === "]")
      lexer.addToken(lexer.tokenTypes.CLOSE_ROUND, lexer.current);
    else if (lexer.current === ",")
      lexer.addToken(lexer.tokenTypes.SEPARATOR, lexer.current);
    else lexer.error("UNKNOWN_CHARACTER", lexer.current);
  }
};

const DFA = {
  recognize: recognize,
  comment: recognizeComment,
  assignOrCompareOp: recognizeAssignOrCompareOperator,
  logicalOp: recognizeLogicalOperator,
  binaryOp: recognizeBinaryAndAssignOperator,
  number: recognizeNumber,
  text: recognizeText,
  identifier: recognizeIdentifierAndKeyword,
  keyword: recognizeKeyword,
};
