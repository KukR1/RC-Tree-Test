/* eslint-disable no-console, react/no-access-state-in-setstate */
////@ts-nocheck
import React, { useState } from 'react';
import { gData } from './util';
import Tree, { TreeNode } from 'rc-tree';
import { DataType, ChildrenType } from './types';

// import "./rc-tree.css";
// import "rc-tree/assets/index.css";
// import "./rc-tree.scss";
import './rc-tree.less';

function switcherIcon(obj: any) {
  if (obj.isLeaf) {
    return '';
  }
  return (
    <i className="rc-tree-switcher-icon">
      <svg
        viewBox="0 0 1024 1024"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z" />
      </svg>
    </i>
  );
}

function Demo() {
  //const gData: DataType[] = [];
  const [data, setData] = useState<DataType[]>({ gData });
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState([
    '0-0-key',
    '0-0-0-key',
    '0-0-0-0-key',
  ]);
  const onDragStart = (info: any) => {
    console.log('start', info);
  };

  const onDragEnter = (info: {
    expandedKeys: React.SetStateAction<string[]>;
  }) => {
    console.log('enter', info);
    setExpandedKeys(info.expandedKeys);
  };

  const onDrop = (info: {
    node: { props: { eventKey: any; pos: string; expanded: any } };
    dragNode: { props: { eventKey: any } };
    dropPosition: number;
    dropToGap: any;
  }) => {
    console.log('drop', info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: DataType[],
      key: string,
      callback: {
        (item: any, index: any, arr: any): void;
        (item: any): void;
        (item: any): void;
        (item: any, index: any, arr: any): void;
        (arg0: DataType, arg1: number, arg2: DataType[]): void;
      }
    ) => {
      Array.from(data).forEach((item, index, arr) => {
        if (item.key === key) {
          callback(item, index, arr);
          return;
        }
        if (item.children) {
          loop(item, key, callback);
        }
      });
    };

    setData([...gData]);

    // Find dragObject
    let dragObj: unknown;
    loop(data, dragKey, (item, index, arr) => {
      Array.from(arr).splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item = item || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.push(dragObj);
      });
    } else if (
      (info.node.props || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.unshift(dragObj);
      });
    } else {
      // Drop on the gap
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar?.splice(i, 0, dragObj);
      } else {
        ar?.splice(i + 1, 0, dragObj);
      }
    }

    setData({ gData: data });
    console.log(`Dropped data: ${JSON.stringify(gData)}`);
  };

  const onExpand = (expandedKeys: React.SetStateAction<string[]>) => {
    console.log('onExpand', expandedKeys);

    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const loop = (data: any[]) =>
    data?.map((item) => {
      if (item && item.length) {
        return (
          <TreeNode key={item.key} title={item.title} active={false}>
            {loop(item)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={item.title} active={false} />;
    });
  //console.log(`data: ${JSON.stringify(gData)}`);
  return (
    <div className="draggable-demo">
      <h2>draggable</h2>
      <p>drag a node into another node</p>
      <div className="draggable-container">
        <Tree
          expandedKeys={expandedKeys}
          onExpand={onExpand}
          autoExpandParent={autoExpandParent}
          draggable
          onDragStart={onDragStart}
          onDragEnter={onDragEnter}
          onDrop={onDrop}
          switcherIcon={switcherIcon}
          treeData={gData}
        />
      </div>
    </div>
  );
}

export default Demo;
