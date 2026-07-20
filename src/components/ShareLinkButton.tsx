import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check, Copy } from "lucide-react";
import { toast } from "sonner";

interface ShareLinkButtonProps {
  refNo?: string | number | null;
  lang?: string | null;
}

const PROJECT_REF = "kiogiyemoqbnuvclneoe";

/**
 * Copies a share URL whose Open Graph tags are rendered server-side by the
 * `property-share` edge function — so WhatsApp / Facebook / iMessage / Slack
 * previews show the property title and image instead of a bare URL.
 */
export const ShareLinkButton = ({ refNo, lang }: ShareLinkButtonProps) => {
  const [copied, setCopied] = useState(false);

  if (!refNo) return null;

  const shareUrl = `https://${PROJECT_REF}.supabase.co/functions/v1/property-share?ref=${encodeURIComponent(
    String(refNo)
  )}${lang && lang !== "en" ? `&lang=${lang}` : ""}`;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ url: shareUrl });
        return;
      }
    } catch {
      /* fall through to clipboard */
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Share link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className="gap-2"
      aria-label="Copy share link with preview"
    >
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      {copied ? "Copied" : "Share with preview"}
    </Button>
  );
};

export default ShareLinkButton;
