import React from "react";
import ReactJson from "@dioxide-js/react-json-view";
import json from "json-bigint";
import Tree from "../../component/Tree"

const data = [
  {
    "module": "react-ui-tree",
    "children": [{
      "collapsed": true,
      "module": "dist",
      "children": [{
        "module": "node.js"
      }]
    }]
  }
]

import "./style.css";

const { useEffect, useState } = React;
const mockdata = [{
  "type": "Section",
  "content": "Test 1"
},
{
  "type": "Trace",
  "content": [{
      "tx_id": 1,
      "tx_info": {
          "InvokeResult": "Success",
          "InvokeContextType": "Normal",
          "Target": "k9t42t90p2bpr1qax573zxghjbv6t7rhgbj9qs6k29as7cyjz5217kh4h0",
          "BuildNum": 1,
          "Timestamp": 1668482898555,
          "Contract": "Ballot",
          "Function": "vote",
          "Arguments": {
              "proposal_index": 1,
              "case_num": 1
          }
      },
      "father": null
  },
  {
      "tx_id": 2,
      "tx_info": {
          "InvokeResult": "Success",
          "InvokeContextType": "Normal",
          "Target": "nmv5yqc1knex4n4d0xqr4keg61ryp6y5k676z0vtmrjvtjm9ar3h7mp09g",
          "BuildNum": 1,
          "Timestamp": 1668482898556,
          "Contract": "Ballot",
          "Function": "vote",
          "Arguments": {
              "proposal_index": 1,
              "case_num": 1
          }
      },
      "father": 1
  },
  {
      "tx_id": 3,
      "tx_info": {
          "InvokeResult": "Success",
          "InvokeContextType": "Normal",
          "Target": "g6sxwc4ad22d2vcr27cwd34gypympnedq9zxg4zdvadmr92vbz206hct38",
          "BuildNum": 1,
          "Timestamp": 1668482898556,
          "Contract": "Ballot",
          "Function": "vote",
          "Arguments": {
              "proposal_index": 2,
              "case_num": 1
          }
      },
      "father": 1
  },
  {
      "tx_id": 4,
      "tx_info": {
          "InvokeResult": "Success",
          "InvokeContextType": "Normal",
          "Target": "p93atpcfvfkyy6pamwg6v06czj92ew1fwsp665xyys91ej1d9rvq71tq3m",
          "BuildNum": 1,
          "Timestamp": 1668482898554,
          "Contract": "Ballot",
          "Function": "vote",
          "Arguments": {
              "proposal_index": 2,
              "case_num": 1
          }
      },
      "father": 3
  }]
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
        mockdata.map(d => {
          if (d.type === 'Section') {
            return <p>{d.content.toString()}</p>
          } 
          if (d.type === 'Trace') {
            return <div className="box"><Tree data={d.content} /></div>
          }
          return (
            <div className="box">
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
