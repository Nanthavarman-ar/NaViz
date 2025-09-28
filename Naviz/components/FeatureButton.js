import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from './ui/button';
import { Badge } from './ui/badge';
export const FeatureButton = ({ feature, active, onToggle, size = 'default' }) => {
    const handleClick = () => {
        onToggle(feature.id, !active);
    };
    return (_jsx(Button, { variant: active ? 'default' : 'outline', size: size, onClick: handleClick, className: `relative ${active ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-gray-700'}`, children: _jsxs("span", { className: "flex items-center gap-2", children: [feature.icon && _jsx("span", { children: feature.icon }), _jsx("span", { children: feature.name }), active && _jsx(Badge, { variant: "secondary", className: "ml-1", children: "ON" })] }) }));
};
export default FeatureButton;
