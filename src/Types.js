console.log("types.js connected!");

const BINARY_OPERATOR = {
  // basic:
  ADDITION: "op-bin-add",
  SUBTRACTION: "op-bin-sub",
  MULTIPLICATION: "op-bin-mul",
  DIVISION: "op-bin-div",
  REMAINDER: "op-bin-rem",

  // others:
  INCREMENT: "op-bin-inc",
  DECREMENT: "op-bin-dec",
  POWER: "op-bin-pow",
};

const ASSIGN_OPERATOR = {
  ASSIGN: "op-assign",

  ADDITION_ASSIGN: "op-add-assign",
  SUBTRACTION_ASSIGN: "op-sub-assign",
  MULTIPLY_ASSIGN: "op-mul-assign",
  DIVISION_ASSIGN: "op-div-assign",
  REMAINDER_ASSIGN: "op-rem-assign",
};

const LOGICAL_OPERATOR = {
  // basic:
  NOT: "op-not",
  AND: "op-and",
  OR: "op-or",

  // others:
  LOGICAL_AND: "op-log-and",
  PIPE: "op-pipe",
};

const COMPARE_OPERATOR = {
  EQUAL: "op-com-equal",
  GREATER: "op-com-greater",
  GREATER_EQUAL: "op-com-greaterEq",
  LESS: "op-com-less",
  LESS_EQUAL: "op-com-lessEq",
};

const ERROR = {
  UNKNOWN_CHARACTER: "error-unknown-char",
  NUMBER_OUT_OF_RANGE: "error-number-out-of-range",
};

//////////////////////////////
const TOKEN_TYPES = {
  // literals:
  TEXT: "text",
  NUMBER: "number",
  KEYWORD: "keyword",
  IDENTIFIER: "identifier",
  CONSTANT: "constant",

  // grouping:
  OPEN_PAREN: "open-paren",
  CLOSE_PAREN: "close-paren",
  OPEN_CURLY: "open-curly",
  CLOSE_CURLY: "close-curly",
  OPEN_ROUND: "open-round",
  CLOSE_ROUND: "close-round",

  // operators:
  BINARY_OPERATOR,
  ASSIGN_OPERATOR,
  LOGICAL_OPERATOR,
  COMPARE_OPERATOR,

  // special symbols:
  COMMENT: "comment",
  SEPARATOR: "separator",

  // error:
  ERROR,
};

const KEYWORDS = [
  "num",
  "txt",
  "void",
  "if",
  "else if",
  "else",
  "for",
  "while",
  "do",
  "return",
];
/////////////////////

const types = {
  TOKEN_TYPES,
  KEYWORDS,
};
