type Message = import("../src/view/messages/messageTypes").Message;

type VSCode = {
  postMessage<T extends Message = Message>(message: T): void;
  getState(): any;
  setState(state: any): void;
  [prop: string]: any;
};

declare const serverUrl: string;
declare const vscode: VSCode;

type CommonStyleComponent = {
  style?: React.CSSProperties;
  className?: string;
};

type BlockSummary = {
  GasFee: string;
  Hash: string;
  Height: number;
  Miner: string;
  Reward: string;
  Shard: [number, number];
  Timestamp: number;
  TxnCount: [number, number];
  Uncle: number;
};

type PeriodicsItem = {
  BuildNum: number;
  Gas: number;
  Grouped: false;
  Size: number;
  Mode: string;
  Input: { Issued: string; [props: string]: string };
  Op: number;
  OpName: string;
  Contract: string;
  ExecIdx: number;
  RetVal: number;
  CoinDelta: string;
};

interface PeriodicsSummaryInList extends PeriodicsItem {
  Height: number;
  Timestamp: number;
  Type: string;
}

interface IntryRelayItem {
  GasPrice: number;
  BuildNum: number;
  Gas: number;
  Grouped: boolean;
  Size: number;
  Mode: string;
  Address: string;
  Input: {
    [key: string]: any;
  };
  Op: number;
  OpName: string;
  Contract: string;
  OrigExecIdx: number;
  ExecIdx: number;
  [key: string]: any;
}

type BlockDetail = {
  Size: number;
  Prev: string;
  ShardIndex: number;
  ShardOrder: number;
  Timestamp: number;
  TxnCount: [number, number];
  Uncle: number;
  TxilmWidth: number;
  BlockBody: string;
  RelayTxnMerkle: string;
  SnapshotCarried: false;
  Consensus: string;
  ScaledBranch: string;
  ScalingNext: false;
  MiningMode: string;
  PowNonce: string;
  PowTarget: [number, number];
  PowDifficulty: number;
  Height: number;
  Hash: string;
  Periodics: PeriodicsItem[];
  Miner: string;
  Txns?: any[];
  IntraRelays?: IntryRelayItem[];
  ExecutionCount: number;
};

type ShardSummary = {
  Height: number;
  Timestamp: number;
  HeadOutWeight: number;
  Throughtput: number;
  BlockInterval: number;
  HashRate: number;
  ForkRate: number;
  FinalityDistance: number;
  SnapshotUpdated: number;
  StateSize: number;
  MempoolSize: number;
  AddressCount: number;
};

type DappSummary = {
  DAppId: number;
  Name: string;
  Vendor: string;
  Owner: string;
  CreationTime: number;
  LastModifyTime: number;
};

type ContractFunctionItem = {
  Name: string;
  OpCode: number;
  Flag: string;
};

type ContractSummary = {
  ContractId: number;
  Name: string;
  BuildNum: number;
  Engine: string;
  Flag: string;
  IR: string;
  Functions: ContractFunctionItem[];
};

type Assets = Array<AssetsItem>;

type AssetFilter = {
  [key in keyof AssetsItem] ?: any
} | ((assets: Assets) => Assets);

type AssetsItem = {
  Address: string;
  AssetId: number;
  Symbol: string;
  Fullname: string;
  Flag: string;
  Suppliers: string[];
};
type DappDetail = {
  Address: string;
  DAppId: number;
  Name: string;
  Vendor: string;
  Owner: string;
  CreationTime: number;
  LastModifyTime: number;
  Contracts: ContractSummary[];
  Assets: AssetsItem[];
};

type TxnSummary = {
  Hash?: string;
  Timestamp: number | string;
  Target: string;
  Type: string;
  Contract: string;
  OpName: string;
  ExecIdx: number;
  RetVal: number;
  RelayEmit: number;
  CoinDelta: string;
  Stage: string;
  Height: number;
  Shard: [number, number];
  [key: string]: any;
};

type RelayItem = {
  Contract: string;
  Gas: number;
  GasPrice: number;
  Input: any;
  Op: number;
  OpName: string;
  OrigExecIdx: number;
};

type TxnDetail = {
  Version: number;
  Timestamp: number;
  Packing: string;
  ISN: number;
  Gas: number;
  GasPrice: number;
  Size: number;
  Address: string;
  Input: any;
  Contract: string;
  Op: number;
  OpName: string;
  Signers: string[];
  Hash: string;
  Profit: number;
  ConfirmState: string;
  RetVal: number;
  ConfirmedBy: {
    Block: string;
    Height: number;
    Shard: [number, number];
  };
  Relays: RelayItem[];
  ConfirmedIn: string[];
  Result: {
    Return: number;
    Height: number;
    CoinSpended: string;
    Input: any;
    Output: any;
  };
  CoinDelta: string;
  Stage: string; // 通过Hash在TxnSummary中获取
};

type HubSummary = {
  Shards: ShardSummary[];
};

type MempoolItem = {
  CoinDelta: string;
  Contract: string;
  GasFee: string;
  Hash: string;
  Height: number;
  OpName: string;
  RelayEmit: number;
  RetVal: number;
  Stage: string;
  Target: string;
  Timestamp: number;
  Type: string;
  Shard?: number;
};
