# PREDA Dev Environment

This is a local developement environment for the PREDA smart contract programming language. PREDA is designed for parallel execution of smart contract transactions on sharding blockchains. The PREDA developement environment includes the prebuilt PREDA compilers and execution engines for Windows, Linux, and MacOS, VSCode extensions, and exmaple smart contracts and execution scripts. After the installation, programmers can edit, compile, and execute PREDA smart contracts in VSCode and check the execution results, e.g., address states on chain.

## Usages

- To compile PREDA smart contract (.prd):

  - use shortcut `Ctrl+5` / `Command + 7`
  - or right click the Text Editor and then click `PREDA: Compile` in editor context menu
  - or click `PREDA: Compile` button in editor title menu
  - or click `PREDA: Compile` button in context menu of file explorer

- To set arguments for PREDA script (.script):
   - use shortcut `Ctrl+6` / `Command + 6`
   - or right click the Text Editor and then click `PREDA: Set Args` in editor context menu
   - or click `PREDA: Set Args` button in editor title menu
   - or click `PREDA: Set Args` button in context menu of file explorer
   - the arguments will be stored in a local file `scriptArgs.json` and be reused for further execution
 
 - To run PREDA script (.srcipt):
 
   - use shortcut `Ctrl+5` / `Command + 5`
   - or right click the Text Editor and then click `PREDA: Run` in editor context menu
   - or click `PREDA: Run` button in editor title menu
   - or click `PREDA: Run` button in context menu of file explorer
   - a new VSCode Tab will be automatically launched after the execuiton of the PREDA script
## PREDA script syntax

### Set random seed

**Description：**

Set the seed to use for random generation, select the timestamp as seed as default 

**Command：**

```
random.reseed [seed]
```

**Parameters：**

- Seed: the default seed is timestamp, but you can set as any value manually 

**Example：**

```
random.reseed
random.reseed 88
```

------

### Allocate address

**Description：**

Generate a specific number of addresses 

**Command：**

```
allocate.address address_number
```

**Parameter：**

- address_number: the number of addresses to be generated

**Example：**

```
allocate.address 100
```

------

### Use address

**Description：**

To use the generated address

**Command：**

```
@address_order
```

**Parameter：**

- address_order：address order n, random, all, represents the number n+1th address, random address, and all addresses respectively. 

**Example：**

```
// Set the state for all address
state.set address.ERC20 @all { balance:"10000000000000" }
// Set the state for an random address, and execute 10 times 
state.set*10 address.ERC20 @random { balance:"20000000000000" }
// Set the state for the 1st address
state.set address.ERC20 @0 { balance:"50000000000000" }
// Set the state for the 11th address
state.set address.ERC20 @10 { balance:"50000000000000" }
// Set the state for the 21th address
state.set address.ERC20 @20 { balance:"50000000000000" }
```

------

### Set gaslimit

**Description：**

Set a limit for all transaction's gaslimit in a block 

**Command：**

```
chain.gaslimit limit
```

**Parameters：**

- limit: the limit for all transaction's gaslimit in a block

**Example：**

```
chain.gaslimit 256
```

------

### Deploy contracts

**Description：**

Deploy contracts, multiple contracts can be deployed

**Command：**

```
chain.deploy contract_name
```

**Parameters：**

- contract_name: the name of the contract, multiple names can be set at the same time, space-separated

**Example：**

```
chain.deploy SimpleStorage.prd
```

**Output：**

```
Compiling 1 contract code(s) ...
contract `SimpleStorage`: 2 function(s) with states in address scope(s)
  0) SimpleStorage.increment: txn
  1) SimpleStorage.decrement: txn
Linking and deploying ...
[PRD]: Successfully deployed 1 contract(s)
```

------

### Call a contract function

**Description：**

Call the contract and generate the transaction into mempool 

**Command：**

```
contract_name.contract_function[*call_number] @address_order contract_params
```

**Parameters：**

- contract_name: the name of the contract
- contract_function: the name of the contract 
- call_number: number of calls, with optional parameter for selection
- address_order: address number of the executed address
- contract_params: contract input parameters 

**Example：**

```
SimpleStorage.increment @0 {n: 5000}
SimpleStorage.increment*100 @random {n: 1000}
```

------

### Run the Chain

**Description：**

Run the blockchain to execute transanctions in the mempool, then add them to block until each shard is archived

**Command：**

```
chain.run
```

**Example：**

```
chain.run
```

------

### Chain Info

**Description：**

Output the number of transactions and addresses of current shard in the blockchain. 

**Command：**

```
chain.info
```

**Example：**

```
chain.info
```

**Output：**

```
Global: h:0 txn:0/0/0 addr:0
Shd#0:  h:0 txn:17/0/0 addr:25
Shd#1:  h:0 txn:31/0/0 addr:25
Shd#2:  h:0 txn:23/0/0 addr:25
Shd#3:  h:0 txn:29/0/0 addr:25
Total Txn:100/0
Stopwatch restarted
```

------

### Print log

**Description：**

Print log 

**Command：**

```
log text
```

**Parameters：**

- text: content of the log

**Example:**

```
log this is log
```

------

### Print highlight log

**Description：**

Print highlight log

**Command：**

```
log.highlight text
```

**Parameters：**

- text: content of the log 

**Example：**

```
log.highlight this is highlight log
```

------

### Set address state

**Description：**

Set the address state for addresses on the blockchain, which typically used to initialize the address contract state. 

**Command：**

```
state.set address.contract_name @address_order { state_name:state_value } 
```

**Parameters：**

- contract_name: the name of the contract 
- address_order: the serial number for address 
- state_name: the name of the state to be set 
- state_value: the value of the state to be set 

**Exmaple：**

```
state.set address.SimpleStorage @0 { storedData:10000 } 
```

------

### Restart Stopwatch

**Description：**

Stop the stopwatch to restart 

**Command：**

```
stopwatch.restart
```

**Example：**

```
stopwatch.restart
```

------

### Report Stopwatch

**Description：**

Report the current time consumption and test performance data 

**Command：**

```
stopwatch.report
```

**Example：**

```
stopwatch.report
```

**Output：**

```
Stopwatch: 5 msec
Order: 2, TPS:20000, uTPS:20000
```

------

### print block info

**Description:**

print block info

**Command:**

```
log.block @shard:height //print block info for shard and height
log.block @all          //print all block info
```

> shard：s

**Example:**

```
log.block @0:0
log.block @all
```

**Output example：**

```json
"Shard#0": 
[
   {
      "Height": 0,
      "PrevBlock": "0000000000000000000000000000000000000000000000000000",
      "Timestamp": 1668064336270,
      "Miner": "y0vhd9053cgyqveybf3qpzx2eanbbwfp4dja676n1vxvm4fwgy8r7gnxcw",
      "TxnCount": 1,
      "ConfirmTxn": 
      [
         {
            "InvokeResult": "Success",
            "InvokeContextType": "Scheduled",
            "BuildNum": 1,
            "Timestamp": 1668064337772,
            "Contract": "SetStateTest",
            "Function": "get_shard"
         }
      ]
   }
]

```

------

### print shard state

**Description:**

Print shard state or global state

**Command:**

```
log.shard @all //print normal shard state
log.shard @g   //print global state
```

**Example:**

```
log.shard @all
```

**Output example：**

```json
"ShardState_all": 
{
   "Shard#0": [{"SetStateTest": {"s1": 21, "s2": 22}}],
   "Shard#1": [{"SetStateTest": {"s1": 21, "s2": 22}}],
   "Shard#2": [{"SetStateTest": {"s1": 21, "s2": 22}}],
   "Shard#3": [{"SetStateTest": {"s1": 21, "s2": 22}}]
}
```

**Example:**

```
log.shard @g
```

**Output example：**

```json
"ShardState_g": {"Shard#65535": [{"SetStateTest": {"g1": 31, "g2": 32}}]}
```

------

### print address state

**Description:**

Print address state

**Command:**

```
log.addr @all
log.addr @order
```

**Example:**

```
log.addr @0
log.addr @all
```

**Output example：**

```json
"AddressState_all": 
[
   {
      "Shard#0": 
      [
         {
            "Address": "8jj4tmf0y797j783xpsqyaeek25v45aetqcf1r4s67nqcqmhzrcg6cpaar",
            "Contract": "SetStateTest",
            "State": {"a1": 11, "a2": 12}
         }
      ]
   },
   {
      "Shard#1": 
      [
         {
            "Address": "y0vhd9053cgyqveybf3qpzx2eanbbwfp4dja676n1vxvm4fwgy8r7gnxcw",
            "Contract": "SetStateTest",
            "State": {"a1": 11, "a2": 12}
         }
      ]
   },
   {
      "Shard#2": 
      [
         {
            "Address": "m84jfdm2b6v9phc75f8jaf05j6vgxcwpppsw2actn8dyaywxw7ym6y0tsg",
            "Contract": "SetStateTest",
            "State": {"a1": 11, "a2": 12}
         }
      ]
   },
   {
      "Shard#3": 
      [
         {
            "Address": "vffgwr07yq323axszgxbr2qp9azzbyjjm844s90z8ack63s6hrch683z48",
            "Contract": "SetStateTest",
            "State": {"a1": 11, "a2": 12}
         }
      ]
   }
]

```

------



**Enjoy!**


