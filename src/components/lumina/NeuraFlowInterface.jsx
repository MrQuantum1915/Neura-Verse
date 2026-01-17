import { useState, useCallback } from 'react';
import { ReactFlow, Controls, applyNodeChanges, applyEdgeChanges, addEdge, Background, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';


function NeuraFlowInterface({ messages, neuraFlow, setNeuraFlow }) {
  console.log("NeuraFlowInterface neuraFlow:", neuraFlow);
  const [nodes, setNodes] = useState(neuraFlow.nodes);
  const [edges, setEdges] = useState(neuraFlow.edges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );
  return (
    <div className="min-w-0 flex-1 m-2 rounded-lg border border-white/30 overflow-hidden">
      <div className='w-full h-full'>
        <ReactFlow
          style={{ backgroundColor: '#0f0f0f' }}
          colorMode='dark'
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