import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { supabase as cloud } from "@/integrations/supabase/client";
import { useMember } from "@/hooks/useMember";
import { cn } from "@/lib/utils";

type Props = { propertyId: string; refNo?: string; title?: string; price?: string; className?: string };

export default function FavoriteButton({ propertyId, refNo, title, price, className }: Props) {
  const { user } = useMember();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return setSaved(false);
    cloud.from("favorites").select("id").eq("property_id", propertyId).maybeSingle().then(({ data }) => setSaved(!!data));
  }, [user, propertyId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast("Join the free VIP Club to save favourites", { action: { label: "Join", onClick: () => (window.location.href = "/vip") } });
      return;
    }
    if (saved) {
      setSaved(false);
      await cloud.from("favorites").delete().eq("property_id", propertyId);
    } else {
      setSaved(true);
      const { error } = await cloud.from("favorites").insert({ user_id: user.id, property_id: propertyId, ref_no: refNo ?? null, title: title ?? null, price_at_save: price ?? null });
      if (error) {
        setSaved(false);
        toast.error("Could not save. Please try again.");
      } else toast.success("Saved to your VIP favourites");
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={saved ? "Remove from favourites" : "Save to favourites"}
      aria-pressed={saved}
      className={cn("flex h-10 w-10 items-center justify-center rounded-full border border-navy-foreground/25 bg-navy/50 text-navy-foreground backdrop-blur-md transition-colors hover:border-gold hover:text-gold", className)}
    >
      <Heart className={cn("h-4 w-4", saved && "fill-gold text-gold")} />
    </button>
  );
}
