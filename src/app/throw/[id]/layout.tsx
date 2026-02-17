import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params.id;
  return {
    title: `Splash Colors on Screen ${id} | Holi Billboard`,
    description: `Join the Holi celebration and splash colors on digital billboard ${id} in real-time.`,
    openGraph: {
      title: `Splash Colors on Screen ${id} | Holi Billboard`,
      description: `I'm taking over billboard ${id}! Join me and paint the city with your vibe.`,
      images: ["/holi_billboard_hero_1771306470035.png"],
    },
  };
}

export default function ThrowLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
