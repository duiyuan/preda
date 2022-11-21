import React, { useEffect } from "react";
import { TreevizReact } from 'treeviz-react';
import Tooltip from './Tooltip'
import * as reactDom from 'react-dom'
import ReactJson from "@dioxide-js/react-json-view";
import {toShard} from '@/utils/strings'

type TreeData = {
  data: any
  name: string
}


const Tree = ({ data, name }: TreeData) => {

  useEffect(() => {
    setTimeout(() => {
      // console.log(data)
      const isFather = (fatherId: string, cData: any): boolean => {
        const fid = Number(fatherId)
        const cfid = Number(cData.father)
        // console.log(fid, cfid, cData);
        if (cfid > 0) {
          if (fid === cfid) {
            return true
          }
          if (fid < cfid) {
            const fdata = data.find((d: any) => Number(d.tx_id) === cfid)
            if (fdata) {
              return isFather(fatherId, fdata)
            }
          }
          return false
        }
        return false
      }
      const links = document.querySelectorAll('path.link')
      const nodes = document.querySelectorAll('.node')
      data.forEach((d: any, index: number) => {
        if (d) {
          const w = (nodes[index]).querySelector('.tree-node')?.clientWidth || 240;
          const translateX = w - 240;
          for (let c = index+1;c < nodes.length;c++) {
            const node = nodes[c] && nodes[c].querySelector('.tree-node')
            const link = links[c-1]
            const currentData = data[c]
            const isCurrentFather = isFather(d.tx_id, currentData)
            // console.log(isCurrentFather, d.tx_id, currentData.father)
            if (node && isCurrentFather) {
              const oldX = Number((node as HTMLElement).style.transform.replace(/[^\d|^\-]/g, ''));
              const newX = Number(translateX) + Number(oldX);
              (node as HTMLElement).style.transform = "translateX(" + newX + "px)";

              // console.log(node, translateX, oldX,);
              if (link) {
                // const oldX = Number((link[c-1] as HTMLElement).style.transform.replace(/[^\d|^\-]/g, '') || 0);
                const newX = Number(translateX) + Number(oldX);
                (link as HTMLElement).style.transform = "translateX(" + newX + "px)";
              }
            }
          }
        }
    })
    }, 1500)
  }, [data])

  return (
    <div className="svg-box">
      <p style={{marginBottom: '10px'}}>{name}</p>
      <TreevizReact
        data={data}
        idKey={'tx_id'}
        relationnalField={'father'}
        nodeWidth={240}
        nodeHeight={100}
        areaHeight={400}
        mainAxisNodeSpacing={1.6}
        secondaryAxisNodeSpacing={1}
        linkShape="curve"
        renderNode={
          (node: any) => {
            const id = node.data.tx_id
            const {
              InvokeContextType,
              ShardIndex = 0,
              ShardOrder = 0,
              Contract,
              AddressIndex,
              Function: Fn
            } = node.data.tx_info
            const isNormalRelayContent = ['Normal', 'Scheduled'].includes(InvokeContextType)
            const isIntraOrDispatch = ['RelayIntra', 'Dispatch'].includes(InvokeContextType)
            if (isIntraOrDispatch) {
              setTimeout(() => {
                const link = document.querySelector(`path.link:nth-child(${id - 1})`)
                if (link) {
                  link.setAttribute('stroke-dasharray', '15 4')
                }
              }, 2000)
            }
            const content = (
              <>
                {isNormalRelayContent ? (
                  <div className='tree-text'>
                    Initiator: <strong>{AddressIndex}</strong>
                  </div>
                  ) : null}
                <div className='tree-text'>
                  [{toShard(ShardIndex)}/{(ShardOrder) ** 2}]: <strong>{Contract}.{Fn}</strong>
                </div>
              </>
            )
            setTimeout(() => {
              reactDom.render(
                node.data.tx_info.Arguments ? (
                  <Tooltip placement={'top'} trigger="hover" overlay={
                    <ReactJson
                      src={node.data.tx_info.Arguments}
                      style={{ background: "none" }}
                      displayObjectSize={false}
                      enableClipboard={false}
                      displayDataTypes={false}
                      displayArrayKey={false}
                      collapsed={2}
                      name={false}
                      theme="chalk"
                    />}>
                    {content}
                  </Tooltip>
                 ) : content
              , document.querySelector(`.tree-node.tree-${id}`))
            }, 500)
            return `
              <div class='tree-node tree-${id}' key='tree-${id}' >
                ${isNormalRelayContent ? (
                  `<div class='tree-text'>
                    Initiator: <strong>${AddressIndex}</strong>
                  </div>`
                  ) : ''}
                <div class='tree-text'>
                  [${toShard(ShardIndex)}/${(ShardOrder) ** 2}]: <strong>${Contract}.${Fn}</strong>
                </div>
              </div>
            `
          }
        }
        onNodeClick={(node) => console.log('you clicked on node ' + node.id)}
        duration={500}
        linkWidth={(node) => 4}
      />

  </div>
  )
}

export default Tree