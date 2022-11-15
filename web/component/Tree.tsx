import React from "react";
import { TreevizReact } from 'treeviz-react';
// import {Treebeard} from 'react-treebeard';
// import * as TreeUI from 'react-ui-tree';

type TreeData = {
  data: any
}

const Tree = ({ data }: TreeData) => {
  const [isToggled, setToggled] = React.useState(true);

  const renderNode = (node: any) => {
    return (
      <span
        // className={clss('node', {
        //   'is-active': node === this.state.active
        // })}
        // onClick={this.onClickNode.bind(null, node)}
      >
        {node.module}
      </span>
    );
  };

  return (
    <TreevizReact
      data={data}
      idKey={'tx_id'}
      relationnalField={'father'}
      nodeWidth={100}
      nodeHeight={50}
      areaHeight={300}
      mainAxisNodeSpacing={2}
      secondaryAxisNodeSpacing={2}
      renderNode={(node: any) =>
        `
          <div class='tree-node'>
            <div><strong>${node.data.tx_info.Contract}</strong></div>
          </div>
        `
      }
      onNodeClick={(node) => console.log('you clicked on node ' + node.id)}
      duration={500}
      linkWidth={(node) => 4}
    />
  )
}

export default Tree