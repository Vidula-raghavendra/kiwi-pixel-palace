
import React from "react";

/** Pixel/3D floating objects for subtle live background */
export default function KiwiBgAnim() {
  // Simple: pastel pixel squares and blurred spheres floating slowly
  return (
    <>
      {/* Pixel blocks */}
      <div className="fixed left-[16vw] top-[12vh] pointer-events-none z-0 animate-float-1" style={{ width: 22, height: 22, background: "#badc5b", opacity: 0.30, borderRadius: "6px", boxShadow: "0 4px 18px #badc5b88" }} />
      <div className="fixed left-[63vw] top-[34vh] pointer-events-none z-0 animate-float-2" style={{ width: 18, height: 18, background: "#fffde8", opacity: 0.16, borderRadius: "6px" }} />
      <div className="fixed left-[88vw] top-[13vh] pointer-events-none z-0 animate-float-1" style={{ width: 20, height: 24, background: "#dbe186", opacity: 0.20, borderRadius: "7px" }} />
      {/* Soft 3D blob */}
      <div className="fixed left-[31vw] top-[68vh] pointer-events-none z-0 animate-float-3"
        style={{ width: 54, height: 38, background: "radial-gradient(circle, #fefbe6 55%, #d1c3ba 100%)", borderRadius: "20px 30px 38px 30px/25px 40px 30px 30px", opacity: .21, filter: "blur(1.5px)" }} />
      <style>
        {`
        @keyframes float1 {
          0% { transform: translateY(0); }
          50% { transform: translateY(-18px);}
          100% { transform: translateY(0); }
        }
        .animate-float-1 { animation: float1 8s ease-in-out infinite; }
        @keyframes float2 {
          0% { transform: translateY(0);}
          45% { transform: translateY(14px);}
          100% { transform: translateY(0);}
        }
        .animate-float-2 { animation: float2 11s ease-in-out infinite; }
        @keyframes float3 {
          0% { transform: scale(1);}
          59% { transform: scale(1.10);}
          100% { transform: scale(1);}
        }
        .animate-float-3 { animation: float3 12s alternate-reverse infinite; }
        `}
      </style>
    </>
  );
}
