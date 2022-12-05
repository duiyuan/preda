import React from "react";
import ReactJson from "@dioxide-js/react-json-view";
import json from "json-bigint";
import Tree from "../../component/Tree";

import './style.scss';
import { DeployBox, AddrBox, ShardBox } from "@/component/BoxItem";

const { useEffect, useState } = React;
const mockdata = 
[
   {
      "type": "Run",
      "content": 
      {
         "script": "c:\\Users\\IDEA\\Documents\\GitHub\\oxd_preda\\simulator\\contracts\\Ballot.prdts"
      }
   },
   {
      "type": "Deploy",
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
            "source": "Token.prd",
            "contract": "Token",
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
   {
      "type": "Shard",
      "command": "viz.shard #all Ballot",
      "content": 
      [
         {
            "ShardIndex": "#0",
            "States": [{"Contract": "Ballot", "State": {"votedWeights": [0, 2, 1]}}]
         },
         {
            "ShardIndex": "#1",
            "States": [{"Contract": "Ballot", "State": {"votedWeights": [0, 0, 3]}}]
         },
         {
            "ShardIndex": "#2",
            "States": [{"Contract": "Ballot", "State": {"votedWeights": [2, 1, 0]}}]
         },
         {
            "ShardIndex": "#3",
            "States": [{"Contract": "Ballot", "State": {"votedWeights": [0, 2, 1]}}]
         }
      ]
   },
   {
      "type": "Shard",
      "command": "viz.shard #g",
      "content": 
      [
         {
            "ShardIndex": "#g",
            "States": 
            [
               {
                  "Contract": "Ballot",
                  "State": 
                  {
                     "controller": "0000000000000000000000000000000000000000000000000000000000:unknown",
                     "current_case": 1,
                     "proposals": 
                     [
                        {"name": "Spring", "totalVotedWeight": 2},
                        {"name": "Yarn", "totalVotedWeight": 5},
                        {"name": "Combat", "totalVotedWeight": 5}
                     ],
                     "last_result": {"topVoted": "Yarn", "case": 1},
                     "shardGatherRatio": 2147483648
                  }
               }
            ]
         }
      ]
   },
   {
      "type": "Shard",
      "command": "viz.shard #0",
      "content": 
      [
         {
            "ShardIndex": "#0",
            "States": [{"Contract": "Ballot", "State": {"votedWeights": [0, 2, 1]}}]
         }
      ]
   },
];

enum LOG_TYPE {
   RUN = 'Run',
   DEPLOY = 'Deploy',
   SECTION = 'Section',
   TRACE = 'Trace',
   SHARD = 'Shard',
   ADDR = 'Addr'
}

type VizLog = {
  type: string
  command?: string
  content: any
}
export const Home = () => {
  return (
    <div className="home">
      { // mockdata PREDA_VIZ_LOG
        (mockdata as VizLog[]).map((d, i) => {
          const type = d.type.replace(/(\w)/i, (_, $1) => {
            return $1.toLocaleUpperCase();
          });
          const title = `viz.${type.replace(/(\w)/i, (_, $1) => {
            return $1.toLocaleLowerCase();
          })}`;
          if (type === LOG_TYPE.RUN) {
            return (
               <p className="run" key={type + i}>
                  <span className="key">“Script”: </span>
                  <span className="val">“{d.content.script}”</span>
               </p>
            );
          } 
          if (type === LOG_TYPE.DEPLOY) {
            return (
               <DeployBox data={d.content} title={title} key={type + i} />
            );
          } 
          if (type === LOG_TYPE.ADDR) {
            return (
               <AddrBox data={d.content} title={d.command} key={type + i} />
            );
          } 
          if (type === LOG_TYPE.SHARD) {
            return (
               <ShardBox data={d.content} title={d.command} key={type + i} />
            );
          } 
          if (type === LOG_TYPE.SECTION) {
            return <p className="section" key={type + i}>{d.content.toString()}</p>
          } 
          if (type === LOG_TYPE.TRACE) {
            return (
              <div className="box"  key={type + i}>
               <div className="box-content">
                {/* {Object.keys(d.content).map(trace => ( */}
                  <Tree data={(d.content as any).map((r: any) => {
                    if (!~r.father) {
                      r.father = null
                    }
                    return r
                  })} name='' />
                {/* ))} */}
               </div>
              </div>
            )
          }
          return (
            <div className="box"  key={type + i}>
               <p className="box-title">{title}</p>
               <div className="box-content">
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
            </div>
          )
        })
      }
    </div>
  );
};
