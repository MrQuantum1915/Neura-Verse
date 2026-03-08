import { create } from 'zustand'

export const useThreadStore = create((set, get) => ({
    messages: {}, // object for optimised branch access in tree (hence not an array!)
    activeNodeId: null,
    threadId: null,
    neuraFlow: { nodes: [], edges: [] },

    setThreadId: (id) => set({ threadId: id }),
    setNeuraFlow: (flow) => set({ neuraFlow: flow }),

    addNeuraFlowNode: (msg) => set((state) => {
        const newNode = {
            id: msg.id.toString(),
            position: { x: 0, y: 0 },
            data: { label: msg.role === 'model' ? 'AI' : 'You', value: msg.content.substring(0, 20) + (msg.content.length > 20 ? '...' : '') },
            type: 'custom-node',
            selected: msg.is_head || false,
        };
        const newEdge = msg.parent_id ? {
            id: `e-${msg.parent_id}-${msg.id}`,
            source: msg.parent_id.toString(),
            target: msg.id.toString(),
            animated: true,
            type: 'custom-edge',
        } : null;

        return {
            neuraFlow: {
                nodes: [...state.neuraFlow.nodes, newNode],
                edges: newEdge ? [...state.neuraFlow.edges, newEdge] : state.neuraFlow.edges
            }
        };
    }),

    deleteNeuraFlowNode: (id) => set((state) => {
        return {
            neuraFlow: {
                nodes: state.neuraFlow.nodes.filter(n => n.id !== id),
                edges: state.neuraFlow.edges.filter(e => e.source !== id && e.target !== id)
            }
        };
    }),

    updateNeuraFlowNodeContent: (id, newContent) => set((state) => {
        const updatedNodes = state.neuraFlow.nodes.map(node => {
            if (node.id === id) {
                return { ...node, data: { ...node.data, value: newContent.substring(0, 20) + (newContent.length > 20 ? '...' : '') } };
            }
            return node;
        });
        return {
            neuraFlow: { ...state.neuraFlow, nodes: updatedNodes }
        };
    }),

    setActiveNodeId: (id) => set({ activeNodeId: id }),

    setAsHeadNode: (id) => set((state) => {
        const updatedMessages = {};
        for (const [key, msg] of Object.entries(state.messages)) {
            updatedMessages[key] = { ...msg, is_head: key === id };
        }

        const updatedNodes = state.neuraFlow.nodes.map(node => ({
            ...node,
            selected: node.id === id
        }));

        return {
            messages: updatedMessages,
            neuraFlow: { ...state.neuraFlow, nodes: updatedNodes }
        };
    }),

    setMessages: (threadid, msgs) => {
        //msgs will be array, convert to object with id as key -> .reduce()
        const msgsobj = msgs.reduce((acc, msg) => {
            acc[msg.id] = msg;
            return acc;
        }, {});

        set({ messages: msgsobj });
    },

    addMessage: (msg) => set((state) => {
        get().addNeuraFlowNode(msg);
        return {
            messages: { ...state.messages, [msg.id]: msg },
            activeNodeId: msg.id,
        };
    }),

    deleteMessage: (id) => set((state) => {
        const newMsgs = { ...state.messages };
        delete newMsgs[id];
        get().deleteNeuraFlowNode(id);
        return {
            messages: newMsgs,
        };
    }),

    // 'id, role , content, ai_model, is_public, thread_name, parent_id, is_head'
    addFirstChunk: (obj, chunk) => set((state) => {
        const { id, ai_model, is_public, thread_name, parent_id, is_head } = obj;
        const newMsg = {
            id,
            role: "model",
            content: chunk,
            ai_model: ai_model,
            is_public: is_public,
            thread_name: thread_name,
            parent_id: parent_id,
            is_head: is_head
        };

        get().addNeuraFlowNode(newMsg);

        return {
            messages: { ...state.messages, [id]: newMsg },
            activeNodeId: id,
        };
    }),

    appendStreamChunk: (id, chunk) => set((state) => {

        const exist = state.messages[id];
        if (!exist) return state;

        const updatedMsg = { ...state.messages };
        updatedMsg[id] = { ...updatedMsg[id], content: updatedMsg[id].content + chunk };

        get().updateNeuraFlowNodeContent(id, updatedMsg[id].content);

        return {
            messages: updatedMsg,
        };
    })
}))

export const getActiveBranch = (state) => {
    const { messages, activeNodeId } = state;

    if (!activeNodeId || !messages[activeNodeId]) {
        return [];
    }

    const branch = [];
    let currentNode = messages[activeNodeId];
    while (currentNode) {
        branch.push(currentNode);
        if (currentNode.parent_id === null) break;
        currentNode = messages[currentNode.parent_id];
    }

    branch.reverse();
    return branch;
}

export const getHeadNodeId = (state) => {
    const messages = Object.values(state.messages);
    if (messages.length === 0) return null;

    let explicitHeadId = null;
    let newestId = messages[0].id;

    for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        if (msg.is_head) {
            explicitHeadId = msg.id;
        }
        if (msg.id > newestId) {
            newestId = msg.id;
        }
    }

    return explicitHeadId || newestId;
}