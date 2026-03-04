// this cannot be called by client as server action, because not using 'use server', this is just a funciton running on server that can be called by sever code.
import 'server-only'; // only server can import this file, not client side

export async function generateFlow(content) {
    let flow = {
        nodes: [],
        edges: []
    };
    const nodes = content.map((e) => {
        return {
            id: e.id.toString(),
            position: { x: 0, y: 0 },
            data: { label: e.role=='model' ? 'AI' : 'You', value: e.content.substring(0, 20) + (e.content.length > 20 ? '...' : '') },
            type: 'custom-node',
            selected: e.is_head || false,
        }
    })

    const edges = content
        .filter(e => e.parent_id !== null) // remove root node
        .map(e => {
            return {
                id: `e-${e.parent_id}-${e.id}`, // added e- prefix to avoid clash with node ids by algorithms like dagre
                source: e.parent_id.toString(),
                target: e.id.toString(),
                animated: true,
                type: 'custom-edge',
            }
        });

    flow.nodes = nodes;
    flow.edges = edges;

    // console.log("Generated flow:", flow);
    return flow;
}