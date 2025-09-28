import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Sparkles, Shield, Mic } from 'lucide-react';
export function FeaturesSection() {
    return (_jsx("section", { className: "py-20 relative", children: _jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4", children: "Cutting-Edge Features" }), _jsx("p", { className: "text-xl text-gray-300 max-w-2xl mx-auto", children: "Advanced 3D management tools designed for the future of digital asset workflows" })] }), _jsx("div", { className: "grid md:grid-cols-3 gap-8", children: [
                        {
                            icon: _jsx(Sparkles, { className: "w-8 h-8" }),
                            title: "Model Import",
                            description: "Support for glTF, FBX, OBJ with auto-optimization and compression"
                        },
                        {
                            icon: _jsx(Shield, { className: "w-8 h-8" }),
                            title: "Access Control",
                            description: "Granular per-client access management with audit logging"
                        },
                        {
                            icon: _jsx(Mic, { className: "w-8 h-8" }),
                            title: "AI Assistant",
                            description: "Voice-controlled workflows in Tamil and English languages"
                        }
                    ].map((feature, index) => (_jsxs("div", { className: "bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 transform hover:scale-105", children: [_jsx("div", { className: "text-cyan-400 mb-4", children: feature.icon }), _jsx("h3", { className: "text-xl font-semibold mb-3 text-white", children: feature.title }), _jsx("p", { className: "text-gray-400", children: feature.description })] }, index))) })] }) }));
}
