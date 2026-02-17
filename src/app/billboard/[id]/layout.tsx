import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params.id;
  return {
    title: `Live Billboard ${id} | Holi Interactive`,
    description: `Watch as people across the city splash colors on this live digital billboard. Real-time Holi celebration in action.`,
    openGraph: {
      title: `Live Billboard ${id} | Holi Interactive`,
      description: `The world's most colorful digital billboard is live! Scan and join the splash.`,
      images: ["/holi_billboard_hero_1771306470035.png"],
    },
  };
}

export default function BillboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
