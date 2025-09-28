import { jsx as _jsx } from "react/jsx-runtime";
import BabylonWorkspace from './BabylonWorkspace';
const WorkspacePage = () => {
    return (_jsx("div", { className: "min-h-screen bg-slate-900 text-white", children: _jsx(BabylonWorkspace, { workspaceId: "main-workspace" }) }));
};
export default WorkspacePage;
