
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users, Mail } from "lucide-react";

interface DashboardCard {
  title: string;
  desc: string;
  icon: React.ReactNode;
  onClick: () => void;
  loading: boolean;
}

export default function DashboardCards({ openCreate, openJoin, openInvite, loading }: {
  openCreate: () => void;
  openJoin: () => void;
  openInvite: () => void;
  loading: boolean;
}) {
  const cards: DashboardCard[] = [
    {
      title: "Create a New Team",
      desc: "Start a new collaboration space!",
      icon: <Plus color="#ad9271" size={36} />,
      onClick: openCreate,
      loading,
    },
    {
      title: "Join a Team",
      desc: "Enter your invite code.",
      icon: <Users color="#8bb47e" size={36} />,
      onClick: openJoin,
      loading,
    },
    {
      title: "Invite a Member",
      desc: "Share your team invite code.",
      icon: <Mail color="#badc5b" size={34} />,
      onClick: openInvite,
      loading,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-14">
      {cards.map((card) => (
        <Button
          key={card.title}
          variant="outline"
          className="pixel-outline bg-[#fdfae8] shadow-[0_2px_0_#ad9271] border-[#ad9271] border-2 text-[#233f24] rounded-lg flex flex-col gap-2 px-6 py-8 items-center hover-scale transition-all min-h-[168px] group"
          style={{
            boxShadow: "0 7px 0 #c4bb77, 0 2px 0 #ad9271",
            fontWeight: 700,
          }}
          onClick={card.onClick}
          disabled={card.loading}
        >
          <div className="mb-2">{card.icon}</div>
          <div className="pixel-font text-lg">{card.title}</div>
          <div className="text-[#917141] text-xs mt-2 mb-1">{card.desc}</div>
          <div className="w-full text-right opacity-15 -mt-2 group-hover:opacity-40 transition-all">▼</div>
        </Button>
      ))}
    </div>
  );
}
