import { create } from 'zustand'

export const useThreadStore = create((set, get) => ({
    messages: {}, // object for optimised branch access in tree (hence not an array!)
    activeNodeId: null,
    threadId: null,

    setActiveNodeId: (id) => set({ activeNodeId: id }),

    setMessages: (threadid, msgs) => {
        //msgs will be array, convert to object with id as key -> .reduce()
        const msgsobj = msgs.reduce((acc, msg) => {
            acc[msg.id] = msg;
            return acc;
        }, {});

        set({ messages: msgsobj, threadId: threadid });
    },

    addMessage: (msg) => set((state) => ({
        messages: { ...state.messages, [msg.id]: msg }
    })),
    
    deleteMessage: (id)=>set((state)=>{
        const newMessages = { ...state.messages };
        delete newMessages[id];
        return { messages: newMessages };
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