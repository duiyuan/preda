# PREDA Dev Environment

This is a local development environment for the PREDA smart contract programming language. PREDA is designed for parallel execution of smart contract transactions on sharding blockchains. The PREDA development environment includes the pre-built PREDA compilers and execution engines for Windows, Linux, and macOS, VSCode extensions, and sample smart contracts and execution scripts. After installation, programmers can use VSCode to edit, compile, and execute PREDA smart contracts in a local blockchain simulator and check the execution results, e.g., address states on the chain.

## Usages

- To compile PREDA smart contract (.prd):

  - use shortcut `Ctrl+5` / `Command + 7`
  - or right click the Text Editor and then click `PREDA: Compile` in editor context menu
  - or click `PREDA: Compile` button in editor title menu
  - or click `PREDA: Compile` button in context menu of file explorer
 ![Alt text](./resource/images/compile.png?raw=true "Compile") 
  

- To set arguments for PREDA script (.script):
   - use shortcut `Ctrl+6` / `Command + 6`
   - or right click the Text Editor and then click `PREDA: Set Args` in editor context menu
   - or click `PREDA: Set Args` button in editor title menu
   - or click `PREDA: Set Args` button in context menu of file explorer
   - the arguments will be stored in a local file `scriptArgs.json` and be reused for further execution
   ![Alt text](./resource/images/edit.png?raw=true "Set Args") 
 
 - To run PREDA script (.srcipt):
 
   - use shortcut `Ctrl+5` / `Command + 5`
   - or right click the Text Editor and then click `PREDA: Run` in editor context menu
   - or click `PREDA: Run` button in editor title menu
   - or click `PREDA: Run` button in context menu of file explorer
   - a new VSCode Tab will be automatically launched after the execuiton of the PREDA script
   ![Alt text](./resource/images/run.png?raw=true "Run") 
   

**Enjoy!**


