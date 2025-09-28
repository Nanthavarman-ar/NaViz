import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from './ui/button';
import { Badge } from './ui/badge';
export const CategoryToggles = ({ featuresByCategory, categoryPanelVisible, handleCategoryToggle }) => {
    if (!Object.values(categoryPanelVisible).some(v => v))
        return null;
    return (_jsxs("div", { className: "p-4 border-b border-gray-700", children: [_jsx("h3", { className: "text-sm font-medium text-gray-300 mb-3", children: "Categories" }), _jsx("div", { className: "flex flex-wrap gap-2", children: Object.keys(featuresByCategory).map(category => (_jsxs(Button, { size: "sm", variant: "outline", onClick: () => handleCategoryToggle(category), className: "text-xs", children: [category.charAt(0).toUpperCase() + category.slice(1), _jsx(Badge, { variant: "secondary", className: "ml-1", children: featuresByCategory[category]?.length || 0 })] }, category))) })] }));
};
export default CategoryToggles;
