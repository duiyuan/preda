import React from "react";
import ReactJson from "@dioxide-js/react-json-view";
import json from "json-bigint";
import Tree from "../../component/Tree"

import "./style.css";

const { useEffect, useState } = React;
const mockdata = [{
  "type": "Section",
  "content": "Test 1"
},
{
  "type": "Trace",
  "content":  {
    "TxnTrace_txn5": 
    [
       {
          "tx_id": 1,
          "tx_info": 
          {
             "InvokeContextType": "Scheduled",
             "Target": "mgswk1dp29jmy3xbgnhd74zpr3nh4ekd19a2pzaj0kp85dew1drb72z6km",
             "BuildNum": 1,
             "Timestamp": 1668704133842,
             "Contract": "Ballot",
             "Function": "finalize"
          },
          "father": null
       },
       {
          "tx_id": 2,
          "tx_info": 
          {
             "InvokeContextType": "RelayInbound",
             "Initiator": "mgswk1dp29jmy3xbgnhd74zpr3nh4ekd19a2pzaj0kp85dew1drb72z6km",
             "OriginateHeight": 27,
             "OriginateShardIndex": 2,
             "OriginateShardOrder": 2,
             "BuildNum": 1,
             "Timestamp": 1668704265406,
             "Contract": "Ballot",
             "Function": "__relaylambda_4"
          },
          "father": 1
       },
       {
          "tx_id": 3,
          "tx_info": 
          {
             "InvokeContextType": "RelayInbound",
             "Initiator": "mgswk1dp29jmy3xbgnhd74zpr3nh4ekd19a2pzaj0kp85dew1drb72z6km",
             "OriginateHeight": 28,
             "OriginateShardIndex": 65535,
             "OriginateShardOrder": 2,
             "BuildNum": 1,
             "Timestamp": 1668704270406,
             "Contract": "Ballot",
             "Function": "__relaylambda_5"
          },
          "father": 2
       },
       {
          "tx_id": 4,
          "tx_info": 
          {
             "InvokeContextType": "RelayInbound",
             "Initiator": "mgswk1dp29jmy3xbgnhd74zpr3nh4ekd19a2pzaj0kp85dew1drb72z6km",
             "OriginateHeight": 28,
             "OriginateShardIndex": 0,
             "OriginateShardOrder": 2,
             "BuildNum": 1,
             "Timestamp": 1668704270406,
             "Contract": "Ballot",
             "Function": "__relaylambda_6",
             "Arguments": {"shardVotes": [30, 18, 27]}
          },
          "father": 3
       },
       {
          "tx_id": 5,
          "tx_info": 
          {
             "InvokeContextType": "RelayInbound",
             "Initiator": "mgswk1dp29jmy3xbgnhd74zpr3nh4ekd19a2pzaj0kp85dew1drb72z6km",
             "OriginateHeight": 28,
             "OriginateShardIndex": 1,
             "OriginateShardOrder": 2,
             "BuildNum": 1,
             "Timestamp": 1668704270406,
             "Contract": "Ballot",
             "Function": "__relaylambda_6",
             "Arguments": {"shardVotes": [24, 27, 24]}
          },
          "father": 3
       },
       {
          "tx_id": 6,
          "tx_info": 
          {
             "InvokeContextType": "RelayInbound",
             "Initiator": "mgswk1dp29jmy3xbgnhd74zpr3nh4ekd19a2pzaj0kp85dew1drb72z6km",
             "OriginateHeight": 28,
             "OriginateShardIndex": 2,
             "OriginateShardOrder": 2,
             "BuildNum": 1,
             "Timestamp": 1668704270406,
             "Contract": "Ballot",
             "Function": "__relaylambda_6",
             "Arguments": {"shardVotes": [39, 6, 30]}
          },
          "father": 3
       },
       {
          "tx_id": 7,
          "tx_info": 
          {
             "InvokeContextType": "RelayInbound",
             "Initiator": "mgswk1dp29jmy3xbgnhd74zpr3nh4ekd19a2pzaj0kp85dew1drb72z6km",
             "OriginateHeight": 28,
             "OriginateShardIndex": 3,
             "OriginateShardOrder": 2,
             "BuildNum": 1,
             "Timestamp": 1668704270406,
             "Contract": "Ballot",
             "Function": "__relaylambda_6",
             "Arguments": {"shardVotes": [33, 30, 12]}
          },
          "father": 3
       }
    ]
 }
},
{
  "type": "Run",
  "content": {
      "script": "d:\\Program Files\\PREDA_Dev_Environment_0.1\\examples\\voting.script"
  }
},
{
  "type": "Block",
  "content": {
      "BlockInfo_2:1": {
          "Shard#2": [{
              "Height": 1,
              "PrevBlock": "q9qnj8z3afaxt000000000000000000000000000000000000000",
              "Timestamp": 1668482899433,
              "Miner": "4kapyjt8k5ye62phejn3je8adrxb3fzdtx6t9qyx9qqmawerad15643atr",
              "TxnCount": 0
          }]
      }
  }
},
{
  "type": "State",
  "content": {
      "ShardState_all": {
          "Shard#0": [{
              "Ballot": {
                  "votedWeights": [143,
                  44,
                  88]
              }
          }],
          "Shard#1": [{
              "Ballot": {
                  "votedWeights": [99,
                  88,
                  88]
              }
          }],
          "Shard#2": [{
              "Ballot": {
                  "votedWeights": [110,
                  88,
                  77]
              }
          }],
          "Shard#3": [{
              "Ballot": {
                  "votedWeights": [66,
                  143,
                  66]
              }
          }]
      }
  }
}]
export const Home = () => {
  return (
    <div className="ui-color-regular">
      <div className="invoke_context">{json.stringify(BuildContext)}</div>
      {
        mockdata.map((d, i) => {
          if (d.type === 'Section') {
            return <p className="section" key={d.type + i}>{d.content.toString()}</p>
          } 
          if (d.type === 'Trace') {
            return (
              <div className="box"  key={d.type + i}>
                {Object.keys(d.content).map(trace => (
                  <Tree data={(d.content as any)[trace]} name={trace} key={trace} />
                ))}
              </div>
            )
          }
          return (
            <div className="box"  key={d.type + i}>
              <ReactJson
                src={(d.content as object)}
                style={{ background: "none" }}
                displayObjectSize={false}
                enableClipboard={false}
                displayDataTypes={false}
                displayArrayKey={false}
                collapsed={2}
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
