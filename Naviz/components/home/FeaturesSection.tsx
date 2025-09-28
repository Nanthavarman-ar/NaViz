import React from 'react';
import { Sparkles, Shield, Mic } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Cutting-Edge Features
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Advanced 3D management tools designed for the future of digital asset workflows
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Sparkles className="w-8 h-8" />,
              title: "Model Import",
              description: "Support for glTF, FBX, OBJ with auto-optimization and compression"
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: "Access Control",
              description: "Granular per-client access management with audit logging"
            },
            {
              icon: <Mic className="w-8 h-8" />,
              title: "AI Assistant",
              description: "Voice-controlled workflows in Tamil and English languages"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-cyan-400 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
