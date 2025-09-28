import { jsx as _jsx } from "react/jsx-runtime";
const MultiUser = ({ scene, isActive }) => {
    if (!isActive)
        return null;
    return (_jsx("div", { className: "absolute top-4 left-4 bg-white p-2 rounded shadow", children: "Multi-User Active" }));
};
export default MultiUser;
