// converted to compenent from this codepen - https://codepen.io/Juba-Loudahi/pen/ByyQvEq
export default function DotsLoader() {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
                {/* Tailwind doesn’t support custom animation-delay out of the box for arbitrary values like 0.2s, so we define our own utility classes (.animation-delay-*) in the custom CSS layer. Hence used animate-mypulse defiend in global css */}
                <div className="w-3 h-3 rounded-full mx-1 animate-mypulse bg-gradient-to-br from-red-400 to-red-300 animation-delay-0" />
                <div className="w-3 h-3 rounded-full mx-1 animate-mypulse bg-gradient-to-br from-orange-400 to-orange-300 animation-delay-200" />
                <div className="w-3 h-3 rounded-full mx-1 animate-mypulse bg-gradient-to-br from-yellow-400 to-yellow-300 animation-delay-400" />
            </div>
        </div>
    );
}
