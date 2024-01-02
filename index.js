console.log("script.js connected!");
// select the elements:
const sourceCodeContainer = document.getElementById("source-code");
const outputDisplay = document.getElementById("output");
const tokenizeBtn = document.getElementById("tokenize-btn");
const resetBtn = document.getElementById("reset-btn");

// event handlers:
tokenizeBtn.onclick = (event) => {
  event.preventDefault();
  console.log("tokenizing...");

  const sourceCode = sourceCodeContainer.value + "\0";
  const lexer = new Lexer(sourceCode);
  lexer.tokenize();
  lexer.display(outputDisplay);
  outputDisplay.rows = lexer.tokens.length === 0 ? 4 : lexer.tokens.length + 2;
  console.log("tokenization complete!");
};

resetBtn.onclick = (event) => {
  event.preventDefault();
  sourceCodeContainer.value = "";
  sourceCode = "";
  outputDisplay.value = "";
  outputDisplay.rows = 4;
};

// set column value:
function setColumns() {
  const columnsPossible = Math.floor(window.innerWidth / 16);
  sourceCodeContainer.cols = columnsPossible;
  outputDisplay.cols = columnsPossible;
}
setColumns();

// resize window:
window.onresize = (event) => {
  event.preventDefault();
  setColumns();
};
