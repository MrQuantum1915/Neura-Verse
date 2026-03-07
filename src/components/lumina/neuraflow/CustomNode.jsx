'use client'
import { Position, Handle, useReactFlow } from '@xyflow/react';
import { Menu, ExternalLink, Flag } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useThreadStore, getHeadNodeId } from '@/store/lumina/useThreadStore';
import { useInterfaceStore } from '@/store/lumina/useInterfaceStore';
import { setThreadHead } from '@/app/playgrounds/(playgrounds)/lumina/_actions/setThreadHead';
import { useRouter } from 'next/navigation';

function CustomNode(props) {

    const router = useRouter();

    const { selected, data } = props;

    const [isSelected, setIsSelected] = useState(selected);
    const [openMenu, setopenMenu] = useState(false);
    const menuRef = useRef(null);
    const setActiveNodeId = useThreadStore((state) => state.setActiveNodeId);
    const setAsHeadNode = useThreadStore((state) => state.setAsHeadNode);
    const CurrThreadID = useThreadStore((state) => state.threadId);

    const headNodeId = useThreadStore(getHeadNodeId);
    const isHead = headNodeId === props.id;

    const setActiveInterface = useInterfaceStore((state) => state.setActiveInterface);
    const { updateNode } = useReactFlow();

    // bring this node to front when menu is open - prevent from going behind other nodes
    useEffect(() => {
        updateNode(props.id, { zIndex: openMenu ? 1000 : 0 });
    }, [openMenu, props.id, updateNode]);

    const setActiveNode = () => {
        setActiveNodeId(props.id);
        router.push(`/playgrounds/lumina/${CurrThreadID}?node=${props.id}`);
    };

    // close menu when click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setopenMenu(false);
            }
        };

        if (openMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [openMenu]);

    return (

        <div className={`
                relative group rounded-xl bg-neutral-900 p-2 w-40 transition-all duration-200 ease-in-out 
                border 
                ${isSelected
                ? 'border-orange-500 ring-1 ring-orange-500/70 shadow-lg shadow-orange-500/40'
                : 'border-orange-500/50 hover:border-orange-500 hover:ring-1 hover:ring-orange-500/40 hover:shadow-lg hover:shadow-orange-500/30'
            }`}

            onClick={(e) => {
                e.stopPropagation();
                setIsSelected(!isSelected);
            }
            }>

            {isHead && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-neutral-950/80 backdrop-blur-sm border border-orange-500/40 text-orange-400 text-[8px] font-semibold tracking-widest uppercase px-2.5 py-[2px] rounded-lg shadow-[0_0_8px_rgba(249,115,22,0.2)] flex items-center gap-1 z-10 pointer-events-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_4px_rgba(249,115,22,0.6)]" />
                    HEAD
                </div>
            )}

            <div className="text-xs text-neutral-400 font-medium">{props.data.label}</div>
            <div className='text-xs text-neutral-200'>{props.data.value}</div>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />

            <div
                ref={menuRef}
                className={`absolute top-1 right-1 z-50 transition-all duration-200 ease-out ${isSelected || openMenu
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
                    }`}
            >
                <div
                    className={`p-1 rounded-sm border transition-colors duration-150 cursor-pointer ${openMenu ? 'bg-white/15 border-white/20 text-white' : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:border-white/15 hover:text-neutral-200'}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setopenMenu(!openMenu);
                    }}
                >
                    <Menu size={12} />
                </div>

                <div
                    className={`absolute top-0 left-full ml-2 w-max bg-neutral-950 border border-white/10 rounded-lg shadow-2xl shadow-black/60 p-0.5 flex flex-col gap-0.5 transition-all duration-75 origin-top-left ${openMenu
                        ? 'opacity-100 scale-100 pointer-events-auto'
                        : 'opacity-0 scale-95 pointer-events-none'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="w-full text-left px-2 py-1 text-[10px] font-medium text-neutral-400 hover:text-black bg-white/0 hover:bg-white rounded transition-all duration-100 flex items-center gap-1.5 group/item cursor-pointer"
                        onClick={() => {
                            setActiveNode();
                            setActiveInterface('chat');
                            setopenMenu(false)
                        }
                        }
                    >
                        <ExternalLink size={10} className="opacity-50 group-hover/item:opacity-100 transition-opacity" />
                        <span>Jump Here</span>
                    </button>

                    <button
                        className="w-full text-left px-2 py-1 text-[10px] font-medium text-neutral-400 hover:text-black bg-white/0 hover:bg-white rounded transition-all duration-100 flex items-center gap-1.5 group/item cursor-pointer"
                        onClick={async () => {
                            setAsHeadNode(props.id);
                            setopenMenu(false);

                            const { error } = await setThreadHead(CurrThreadID, props.id);
                            if (error) {
                                console.error("Failed to set thread head: ", error);
                            }
                        }}
                    >
                        <Flag size={10} className="opacity-50 group-hover/item:opacity-100 transition-opacity" />
                        <span>Set as Head</span>
                    </button>
                </div>
            </div>
        </div>

    )
}

export default CustomNode