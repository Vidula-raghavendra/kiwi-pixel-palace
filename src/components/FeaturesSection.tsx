
import React from "react";
import { MessageSquareText, Video, Clock, FileCode, Download, Lock } from "lucide-react";

const features = [
  {
    icon: MessageSquareText,
    label: "Dual AI Assistants",
    description: "Chat with two AI models simultaneously and compare responses",
    color: "bg-[#badc5b]"
  },
  {
    icon: Video,
    label: "Real-Time Presence",
    description: "See who's online and collaborate together instantly",
    color: "bg-[#8bb47e]"
  },
  {
    icon: Clock,
    label: "Instant Workspaces",
    description: "Create teams and share invite codes in seconds",
    color: "bg-[#f59e42]"
  },
  {
    icon: FileCode,
    label: "Smart To-Do Lists",
    description: "Track tasks and stay organized in each workspace",
    color: "bg-[#ffe6ef]"
  },
  {
    icon: Download,
    label: "Export Conversations",
    description: "Save important AI chats as PDFs for reference",
    color: "bg-[#bbeaff]"
  },
  {
    icon: Lock,
    label: "Secure by Default",
    description: "GitHub OAuth and encrypted data storage",
    color: "bg-[#aef6c7]"
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full max-w-6xl mx-auto my-16 px-4">
      <div className="pixel-font text-3xl md:text-4xl mb-8 text-center text-[#233f24] tracking-wide">
        Everything You Need
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => {
          const IconComponent = f.icon;
          return (
            <div
              key={i}
              className="bg-[#fffdf3] border-4 border-[#233f24] p-6 shadow-[0_4px_0_#ad9271] hover:shadow-[0_6px_0_#ad9271] hover:translate-y-[-2px] transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={`${f.color} border-2 border-[#233f24] w-14 h-14 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-7 h-7 text-[#233f24]" />
                </div>
                <div>
                  <h3 className="pixel-font text-base text-[#233f24] mb-2 leading-tight">{f.label}</h3>
                  <p className="pixel-font text-xs text-[#7b6449] leading-relaxed">{f.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
