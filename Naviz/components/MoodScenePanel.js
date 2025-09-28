import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from './ui/button';
export const MoodScenePanel = ({ sceneManager, onClose }) => {
    return (_jsxs("div", { className: "fixed top-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600", children: [_jsx("h3", { className: "text-white mb-2", children: "Mood Scene Panel" }), _jsx("p", { className: "text-slate-300 text-sm", children: "Mood scene controls" }), _jsx(Button, { size: "sm", variant: "outline", onClick: onClose, className: "mt-2", children: "Close" })] }));
};
export default MoodScenePanel;
