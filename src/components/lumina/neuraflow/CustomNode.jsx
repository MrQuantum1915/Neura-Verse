'use client'
import { Position, Handle } from '@xyflow/react';
import { Menu, ExternalLink } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useThreadStore } from '@/store/lumina/useThreadStore';
import { useInterfaceStore } from '@/store/lumina/useInterfaceStore';

function CustomNode(props) {
    const { selected, data } = props;

    const [isSelected, setIsSelected] = useState(selected);
    const [openMenu, setopenMenu] = useState(false);
    const menuRef = useRef(null);
    const setActiveNodeId = useThreadStore((state) => state.setActiveNodeId);

    const setActiveInterface = useInterfaceStore((state) => state.setActiveInterface);

    const setActiveNode = () => {
        setActiveNodeId(props.id);
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
                relative group rounded-xl bg-black p-2 w-40 transition-all duration-200 ease-in-out 
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
                    className={`p-1.5 rounded-lg transition-colors duration-200 cursor-pointer ${openMenu ? 'bg-white/10 text-white' : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setopenMenu(!openMenu);
                    }}
                >
                    <Menu className="w-3.5 h-3.5" />
                </div>

                <div
                    className={`absolute top-0 left-full ml-2 w-max bg-neutral-950/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl shadow-black/50 p-0.5 flex flex-col gap-0.5 transition-all duration-100 origin-top-left ${openMenu
                        ? 'opacity-100 scale-100 translate-x-0 pointer-events-auto'
                        : 'opacity-0 scale-90 -translate-x-2 pointer-events-none'}`}
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
                </div>
            </div>
        </div>

    )
}

export default CustomNode