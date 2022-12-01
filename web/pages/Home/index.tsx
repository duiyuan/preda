import React from "react";
import ReactJson from "@dioxide-js/react-json-view";
import json from "json-bigint";
import Tree from "../../component/Tree";

import './style.scss';

const { useEffect, useState } = React;
const mockdata = 
[
  {
     "type": "Run",
     "content": 
     {
        "script": "/Users/bensonye/Documents/GitHub/oxd_preal/simulator/contracts/Ballot.prdts"
     }
  },
  {
     "type": "Run",
     "content": 
     [
        {
           "source": "Ballot.prd",
           "contract": "Ballot",
           "flag": "ShardHasState|AddressHasState|GlobalHasState",
           "functions": 
           [
              {
                 "name": "init",
                 "flag": "InvokeByNormalTransaction|EmitRelayInGlobalScope|GlobalStateDependency",
                 "opcode": 0
              },
              {
                 "name": "vote",
                 "flag": "InvokeByNormalTransaction|GlobalStateDependency",
                 "opcode": 1
              },
              {
                 "name": "finalize",
                 "flag": "InvokeByNormalTransaction|EmitRelayInGlobalScope|GlobalStateDependency",
                 "opcode": 2
              },
              {
                 "name": "__relaylambda_3",
                 "flag": "InvokeByRelayTransaction|GlobalStateDependency",
                 "opcode": 3
              },
              {
                 "name": "__relaylambda_4",
                 "flag": "InvokeByRelayTransaction|EmitRelayInShardScope|GlobalStateDependency",
                 "opcode": 4
              },
              {
                 "name": "__relaylambda_5",
                 "flag": "InvokeByRelayTransaction|EmitRelayInGlobalScope",
                 "opcode": 5
              },
              {
                 "name": "__relaylambda_6",
                 "flag": "InvokeByRelayTransaction|GlobalStateDependency",
                 "opcode": 6
              }
           ]
        },
        {
           "source": "ERC20.prd",
           "contract": "ERC20",
           "flag": "AddressHasState",
           "functions": 
           [
              {
                 "name": "transfer",
                 "flag": "InvokeByNormalTransaction|EmitRelayInAddressScope",
                 "opcode": 0
              },
              {
                 "name": "transfer_n",
                 "flag": "InvokeByNormalTransaction|EmitRelayInAddressScope",
                 "opcode": 1
              },
              {
                 "name": "__relaylambda_2",
                 "flag": "InvokeByRelayTransaction",
                 "opcode": 2
              },
              {
                 "name": "__relaylambda_3",
                 "flag": "InvokeByRelayTransaction",
                 "opcode": 3
              }
           ]
        }
     ]
  },
  {"type": "Section", "content": "TESTSECTION"},
  {
     "type": "Run",
     "content": 
     {
        "ShardState_all": 
        {
           "Shard#0": [{"Ballot": {"votedWeights": [110, 50, 90]}}],
           "Shard#1": [{"Ballot": {"votedWeights": [100, 80, 70]}}],
           "Shard#2": [{"Ballot": {"votedWeights": [80, 80, 90]}}],
           "Shard#3": [{"Ballot": {"votedWeights": [80, 100, 70]}}]
        }
     }
  },
  {
     "type": "Run",
     "content": 
     {
        "TxnInfo_txn5": 
        [
           {
              "InvokeContextType": "Scheduled",
              "Target": "mp3epf58esfdwys9zsjgfe9qveacf0j7244tde11pa31xkdjv84t7n70ew",
              "BuildNum": 1,
              "Timestamp": 1668756670044,
              "Contract": "Ballot",
              "Function": "finalize",
              "Height": 27,
              "ShardIndex": 0,
              "ShardOrder": 2
           }
        ]
     }
  },
  {
     "type": "Trace",
     "content": 
     {
        "TxnTrace_txn5": 
        [
           {
              "tx_id": 1,
              "tx_info": 
              {
                 "InvokeContextType": "Scheduled",
                 "Target": "mp3epf58esfdwys9zsjgfe9qveacf0j7244tde11pa31xkdjv84t7n70ew",
                 "BuildNum": 1,
                 "Timestamp": 1668756670044,
                 "Contract": "Ballot",
                 "Function": "finalize",
                 "Height": 27,
                 "ShardIndex": 0,
                 "ShardOrder": 2
              },
              "father": -1
           },
           {
              "tx_id": 2,
              "tx_info": 
              {
                 "InvokeContextType": "RelayInbound",
                 "Initiator": "mp3epf58esfdwys9zsjgfe9qveacf0j7244tde11pa31xkdjv84t7n70ew",
                 "OriginateHeight": 27,
                 "OriginateShardIndex": 0,
                 "OriginateShardOrder": 2,
                 "BuildNum": 1,
                 "Timestamp": 1668756802279,
                 "Contract": "Ballot",
                 "Function": "__relaylambda_4",
                 "Height": 28,
                 "ShardIndex": 65535,
                 "ShardOrder": 2
              },
              "father": 1
           },
           {
              "tx_id": 3,
              "tx_info": 
              {
                 "InvokeContextType": "RelayInbound",
                 "Initiator": "mp3epf58esfdwys9zsjgfe9qveacf0j7244tde11pa31xkdjv84t7n70ew",
                 "OriginateHeight": 28,
                 "OriginateShardIndex": 65535,
                 "OriginateShardOrder": 2,
                 "BuildNum": 1,
                 "Timestamp": 1668756807279,
                 "Contract": "Ballot",
                 "Function": "__relaylambda_5",
                 "Height": 28,
                 "ShardIndex": 1,
                 "ShardOrder": 2
              },
              "father": 2
           },
           {
              "tx_id": 4,
              "tx_info": 
              {
                 "InvokeContextType": "RelayInbound",
                 "Initiator": "mp3epf58esfdwys9zsjgfe9qveacf0j7244tde11pa31xkdjv84t7n70ew",
                 "OriginateHeight": 28,
                 "OriginateShardIndex": 65535,
                 "OriginateShardOrder": 2,
                 "BuildNum": 1,
                 "Timestamp": 1668756807279,
                 "Contract": "Ballot",
                 "Function": "__relaylambda_5",
                 "Height": 28,
                 "ShardIndex": 2,
                 "ShardOrder": 2
              },
              "father": 2
           },
           {
              "tx_id": 5,
              "tx_info": 
              {
                 "InvokeContextType": "RelayInbound",
                 "Initiator": "mp3epf58esfdwys9zsjgfe9qveacf0j7244tde11pa31xkdjv84t7n70ew",
                 "OriginateHeight": 28,
                 "OriginateShardIndex": 65535,
                 "OriginateShardOrder": 2,
                 "BuildNum": 1,
                 "Timestamp": 1668756807279,
                 "Contract": "Ballot",
                 "Function": "__relaylambda_5",
                 "Height": 28,
                 "ShardIndex": 3,
                 "ShardOrder": 2
              },
              "father": 2
           },
           {
              "tx_id": 6,
              "tx_info": 
              {
                 "InvokeContextType": "RelayInbound",
                 "Initiator": "mp3epf58esfdwys9zsjgfe9qveacf0j7244tde11pa31xkdjv84t7n70ew",
                 "OriginateHeight": 28,
                 "OriginateShardIndex": 65535,
                 "OriginateShardOrder": 2,
                 "BuildNum": 1,
                 "Timestamp": 1668756807279,
                 "Contract": "Ballot",
                 "Function": "__relaylambda_5",
                 "Height": 28,
                 "ShardIndex": 0,
                 "ShardOrder": 2
              },
              "father": 2
           },
           {
              "tx_id": 7,
              "tx_info": 
              {
                 "InvokeContextType": "RelayInbound",
                 "Initiator": "mp3epf58esfdwys9zsjgfe9qveacf0j7244tde11pa31xkdjv84t7n70ew",
                 "OriginateHeight": 28,
                 "OriginateShardIndex": 1,
                 "OriginateShardOrder": 2,
                 "BuildNum": 1,
                 "Timestamp": 1668756807279,
                 "Contract": "Ballot",
                 "Function": "__relaylambda_6",
                 "Arguments": {"shardVotes": [100, 80, 70]},
                 "Height": 31,
                 "ShardIndex": 65535,
                 "ShardOrder": 2
              },
              "father": 3
           },
           {
              "tx_id": 8,
              "tx_info": 
              {
                 "InvokeContextType": "RelayInbound",
                 "Initiator": "mp3epf58esfdwys9zsjgfe9qveacf0j7244tde11pa31xkdjv84t7n70ew",
                 "OriginateHeight": 28,
                 "OriginateShardIndex": 2,
                 "OriginateShardOrder": 2,
                 "BuildNum": 1,
                 "Timestamp": 1668756807280,
                 "Contract": "Ballot",
                 "Function": "__relaylambda_6",
                 "Arguments": {"shardVotes": [80, 80, 90]},
                 "Height": 29,
                 "ShardIndex": 65535,
                 "ShardOrder": 2
              },
              "father": 4
           },
           {
              "tx_id": 9,
              "tx_info": 
              {
                 "InvokeContextType": "RelayInbound",
                 "Initiator": "mp3epf58esfdwys9zsjgfe9qveacf0j7244tde11pa31xkdjv84t7n70ew",
                 "OriginateHeight": 28,
                 "OriginateShardIndex": 3,
                 "OriginateShardOrder": 2,
                 "BuildNum": 1,
                 "Timestamp": 1668756807280,
                 "Contract": "Ballot",
                 "Function": "__relaylambda_6",
                 "Arguments": {"shardVotes": [80, 100, 70]},
                 "Height": 30,
                 "ShardIndex": 65535,
                 "ShardOrder": 2
              },
              "father": 5
           },
           {
              "tx_id": 10,
              "tx_info": 
              {
                 "InvokeContextType": "RelayIntra",
                 "Initiator": "mp3epf58esfdwys9zsjgfe9qveacf0j7244tde11pa31xkdjv84t7n70ew",
                 "OriginateHeight": 28,
                 "OriginateShardIndex": 0,
                 "OriginateShardOrder": 2,
                 "BuildNum": 1,
                 "Timestamp": 1668756807279,
                 "Contract": "Ballot",
                 "Function": "__relaylambda_6",
                 "Arguments": {"shardVotes": [110, 50, 90]},
                 "Height": 32,
                 "ShardIndex": 65535,
                 "ShardOrder": 2
              },
              "father": 6
           }
        ]
     }
  }
]

enum LOG_TYPE {
   RUN = 'Run',
   SECTION = 'Section',
   TRACE = 'Trace'
}

type VizLog = {
  type: string
  content: any
}
export const Home = () => {
  return (
    <div className="ui-color-regular">
      {
        (PREDA_VIZ_LOG as VizLog[]).map((d, i) => {
          const type = d.type.replace(/(\w)/i, (_, $1) => {
            return $1.toLocaleUpperCase();
          });
          if (type === LOG_TYPE.RUN) {
            return (
               <p className="run" key={type + i}>
                  <span className="key">"script": </span>
                  <span className="val">"{d.content.script}"</span>
               </p>
            );
          } 
          if (type === LOG_TYPE.SECTION) {
            return <p className="section" key={type + i}>{d.content.toString()}</p>
          } 
          if (type === LOG_TYPE.TRACE) {
            return (
              <div className="box-normal"  key={type + i}>
                {/* {Object.keys(d.content).map(trace => ( */}
                  <Tree data={(d.content as any).map((r: any) => {
                    if (!~r.father) {
                      r.father = null
                    }
                    return r
                  })} name='' />
                {/* ))} */}
              </div>
            )
          }
          return (
            <div className="box-normal"  key={type + i}>
              <ReactJson
                src={(d.content as object)}
                style={{ background: "none" }}
                displayObjectSize={false}
                enableClipboard={false}
                displayDataTypes={false}
                displayArrayKey={false}
                collapsed={false}
                name={false}
                theme="chalk"
              />
            </div>
          )
        })
      }
    </div>
  );
};
