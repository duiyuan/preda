import React from "react";
import { TreevizReact } from 'treeviz-react';
import Tooltip from './Tooltip'
import * as reactDom from 'react-dom'
import ReactJson from "@dioxide-js/react-json-view";

type TreeData = {
  data: any
  name: string
}

const Tree = ({ data, name }: TreeData) => {

  return (
    <>
      <p style={{marginBottom: '10px'}}>{name}</p>
      <TreevizReact
        data={data}
        idKey={'tx_id'}
        relationnalField={'father'}
        nodeWidth={200}
        nodeHeight={80}
        areaHeight={300}
        mainAxisNodeSpacing={1.5}
        secondaryAxisNodeSpacing={2}
        linkShape="quadraticBeziers"
        renderNode={(node: any) => {
            setTimeout(() => {
              reactDom.render(
              // <Tooltip placement={'top'} trigger="hover" overlay={
              //   <ReactJson
              //     src={node.data.tx_info.Arguments}
              //     style={{ background: "none" }}
              //     displayObjectSize={false}
              //     enableClipboard={false}
              //     displayDataTypes={false}
              //     displayArrayKey={false}
              //     collapsed={2}
              //     name={false}
              //     theme="chalk"
              //   />}>
                <>
                  <div className='tree-text'>Contract: <strong>{node.data.tx_info.Contract}</strong></div>
                  <div className='tree-text'>Function: <strong>{node.data.tx_info.Function}</strong></div>
                </>
              // </Tooltip>
              , document.querySelector(`.tree-node.tree-${node.data.tx_id}`))
            }, 500)
            return `
              <div class='tree-node tree-${node.data.tx_id}' key='tree-${node.data.tx_id}' >
                
              </div>
            `
          }
        }
        onNodeClick={(node) => console.log('you clicked on node ' + node.id)}
        duration={500}
        linkWidth={(node) => 4}
      />

  </>
  )
}

export default Tree