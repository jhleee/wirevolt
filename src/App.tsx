import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Connection,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ControlPanel } from './components/ControlPanel';
import { WireframeNode } from './components/WireframeNode';
import { useWireframeStore } from './store/wireframe';
import { AlignHorizontalJustifyCenterIcon } from 'lucide-react';
import { Button } from './components/ui/button';

const nodeTypes = {
  wireframeNode: WireframeNode,
};

function Flow() {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    setNodes: setStoreNodes,
    setEdges: setStoreEdges,
    setSelectedElement,
  } = useWireframeStore();

  const onNodesChange = React.useCallback(
    (changes) => {
      console.log(changes);
      setStoreNodes(
        [...storeNodes].map((node) => {
          const change = changes.find((c) => c.id === node.id);
          console.log(change);
          if (
            change &&
            change.type === 'position' &&
            change.position?.x &&
            change.position?.y
          ) {
            return { ...node, position: change.position };
          }
          return node;
        })
      );
    },
    [setStoreNodes, storeNodes]
  );

  const onEdgesChange = React.useCallback(
    (changes: any[]) => {
      console.log(changes);
      const newEdges = [...storeEdges];
      changes.forEach((change) => {
        const index = newEdges.findIndex((e) => e.id === change.id);
        if (index !== -1) {
          newEdges[index] = { ...newEdges[index], ...change };
        }
      });
      setStoreEdges(newEdges);
    },
    [storeEdges, setStoreEdges]
  );

  const onConnect = React.useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        data: { description: '' },
      };
      console.log(storeEdges);
      setStoreEdges([...storeEdges, newEdge]);
    },
    [storeEdges, setStoreEdges]
  );

  const alignNodes = () => {
    const newNodes = storeNodes.map((node, index) => ({
      ...node,
      position: {
        x: 100 + (index % 3) * 300,
        y: 100 + Math.floor(index / 3) * 200,
      },
    }));
    setStoreNodes(newNodes);
  };

  return (
    <div className="flex flex-col h-full">
      {/* <pre>{JSON.stringify(storeNodes, null, 2)}</pre>
      <pre>{JSON.stringify(storeEdges, null, 2)}</pre> */}
      <ReactFlow
        nodes={storeNodes}
        edges={storeEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => setSelectedElement('node', node.id)}
        onEdgeClick={(_, edge) => setSelectedElement('edge', edge.id)}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-right">
          <Button
            variant="secondary"
            size="icon"
            onClick={alignNodes}
            className="mr-2"
          >
            <AlignHorizontalJustifyCenterIcon className="h-4 w-4" />
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

function App() {
  return (
    <div className="flex h-screen">
      <ControlPanel />
      <div className="flex-1">
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
      </div>
    </div>
  );
}

export default App;
