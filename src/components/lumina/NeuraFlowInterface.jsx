"use client";
import { useState, useEffect, useCallback } from 'react';
import { ReactFlow, Controls, applyNodeChanges, applyEdgeChanges, addEdge, Background, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

import CustomNode from './neuraflow/CustomNode';
import { CustomEdge } from './neuraflow/CustomEdge';

const nodeWidth = 300;
const nodeHeight = 80;
const nodeTypes = {
  'custom-node': CustomNode,
};
const edgeTypes = {
  'custom-edge': CustomEdge,
};

function getLayoutedElements(nodes, edges, direction = 'TB') {
  if (!dagre || !dagre.graphlib) {
    console.error('Dagre not loaded properly:', dagre);
    return { nodes, edges };
  }
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction, ranksep: 10, nodesep: 10 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};



function NeuraFlowInterface({ messages, neuraFlow, setneuraFlow }) {

  const [nodes, setNodes] = useState(neuraFlow.nodes);
  const [edges, setEdges] = useState(neuraFlow.edges);


  useEffect(() => {

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      neuraFlow.nodes,
      neuraFlow.edges,
      'TB'
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges.map(edge => ({ ...edge, style: { ...edge.style, stroke: 'orange' } })));
    // setneuraFlow({ nodes: layoutedNodes, edges: layoutedEdges });
  }, [neuraFlow, setneuraFlow]);


  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge({ ...params, type: 'custom-edge', style: { stroke: 'orange' } }, edgesSnapshot)),
    [],
  );


  // related to nodes


  return (
    <div className="min-w-0 flex-1 m-2 rounded-lg border border-white/30 overflow-hidden">
      <div className='w-full h-full'>
        <ReactFlow
          style={{ backgroundColor: '#0f0f0f' }}
          colorMode='dark'
          defaultEdgeOptions={{ type: 'custom-edge', style: { stroke: 'orange' } }}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls position='top-right' />
        </ReactFlow>
      </div>
    </div>
  )
}

export default NeuraFlowInterface