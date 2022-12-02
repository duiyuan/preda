import React from "react";
import ReactJson from "@dioxide-js/react-json-view";
import json from "json-bigint";
import Tree from "../../component/Tree";

import './style.scss';
import { DeployBox, AddrBox } from "@/component/BoxItem";

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
      "type": "Txn",
      "command": "viz.txn txn5",
      "content": 
      [
         {
            "InvokeContextType": "Normal",
            "Target": "j2hskc1hqkqp4f32wh570kp7zqxktkf8zcare8kpj7b3ntdyx0my6wf48g:ed25519",
            "AddressIndex": "@0",
            "BuildNum": 1,
            "Timestamp": 1669969542206,
            "Contract": "Ballot",
            "Function": "finalize",
            "InvokeResult": "Success",
            "Height": 3,
            "ShardIndex": 2,
            "ShardOrder": 2
         }
      ]
   },
   {
      "type": "Addr",
      "command": "viz.addr @0",
      "content": 
      [
         {
            "Address": "j2hskc1hqkqp4f32wh570kp7zqxktkf8zcare8kpj7b3ntdyx0my6wf48g:ed25519",
            "AddressIndex": "@0",
            "States": 
            [
               {
                  "Contract": "Ballot",
                  "State": {"weight": 11, "voted_case": 1}
               },
               {"Contract": "Token", "State": {"balance": "50000000000000"}}
            ]
         }
      ]
   },
   {
      "type": "Addr",
      "command": "viz.addr @0 Ballot",
      "content": 
      [
         {
            "Address": "j2hskc1hqkqp4f32wh570kp7zqxktkf8zcare8kpj7b3ntdyx0my6wf48g:ed25519",
            "AddressIndex": "@0",
            "States": 
            [
               {
                  "Contract": "Ballot",
                  "State": {"weight": 11, "voted_case": 1}
               }
            ]
         }
      ]
   }
];

enum LOG_TYPE {
   RUN = 'Run',
   DEPLOY = 'Deploy',
   SECTION = 'Section',
   TRACE = 'Trace',
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
