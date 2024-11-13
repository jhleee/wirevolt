import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';

interface WireframeState {
  nodes: Node[];
  edges: Edge[];
  selectedElement: { type: 'node' | 'edge' | null; id: string | null };
  addNode: () => void;
  updateNode: (id: string, data: any) => void;
  updateEdge: (id: string, data: any) => void;
  setSelectedElement: (type: 'node' | 'edge' | null, id: string | null) => void;
  addAction: (nodeId: string, action: string) => void;
  removeAction: (nodeId: string, actionIndex: number) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
}

interface EdgeData {
  description?: string;
  color?: string;
  arrowType?: 'arrow' | 'bidirectional' | 'none';
}

const initialNodes: Node[] = [
  {
    id: 'node-1',
    type: 'wireframeNode',
    position: { x: 100, y: 100 },
    data: {
      title: 'Welcome',
      description: 'Start by adding some nodes',
      actions: [],
    },
  },
];

export const useWireframeStore = create<WireframeState>()((set) => ({
  nodes: initialNodes,
  edges: [],
  selectedElement: { type: null, id: null },

  addNode: () =>
    set((state) => {
      const newNode: Node = {
        id: `node-${state.nodes.length + 1}`,
        type: 'wireframeNode',
        position: {
          x: Math.random() * 500,
          y: Math.random() * 500,
        },
        data: {
          title: 'New Node',
          description: 'Description here',
          actions: [],
        },
      };
      return { nodes: [...state.nodes, newNode] };
    }),

  updateNode: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      ),
    })),

  updateEdge: (id, data) =>
    set((state) => ({
      edges: state.edges.map((edge) => {
        if (edge.id === id) {
          const newEdge = { ...edge };
          // 엣지 타입 업데이트
          if (data.type) {
            newEdge.type = data.type;
          }
          // 엣지 스타일 업데이트
          if (data.color || data.arrowType) {
            newEdge.style = {
              ...newEdge.style,
              stroke: data.color || newEdge.style?.stroke,
            };
            // 화살표 타입에 따른 마커 설정
            if (data.arrowType) {
              switch (data.arrowType) {
                case 'arrow':
                  newEdge.markerEnd = { type: 'arrow' };
                  newEdge.markerStart = undefined;
                  break;
                case 'bidirectional':
                  newEdge.markerEnd = { type: 'arrow' };
                  newEdge.markerStart = { type: 'arrow' };
                  break;
                case 'none':
                  newEdge.markerEnd = undefined;
                  newEdge.markerStart = undefined;
                  break;
              }
            }
          }
          // 기타 데이터 업데이트
          newEdge.data = { ...newEdge.data, ...data };
          return newEdge;
        }
        return edge;
      }),
    })),

  setSelectedElement: (type, id) =>
    set({
      selectedElement: { type, id },
    }),

  addAction: (nodeId, action) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: { ...node.data, actions: [...node.data.actions, action] },
            }
          : node
      ),
    })),

  removeAction: (nodeId, actionIndex) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                actions: node.data.actions.filter(
                  (_, index) => index !== actionIndex
                ),
              },
            }
          : node
      ),
    })),

  setNodes: (nodes: Node[]) => set({ nodes }),
  setEdges: (edges: Edge[]) =>
    set({ edges: Array.isArray(edges) ? edges : [] }),
}));
