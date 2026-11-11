import aliKaranPortrait from '@/assets/ali-karan-founder.webp';
import saminPortrait from '@/assets/team/samin-portrait.webp.asset.json';

// Temporary image overrides applied on top of the team_members table data.
// Remove an entry once the matching record has been updated in the admin panel.
export const TEAM_IMAGE_OVERRIDES: Record<string, string> = {
  "8a68b67c-c06f-4432-93e1-11b5301c7483": aliKaranPortrait,
  // Samin (AI Manager) — new studio portrait with the light team background.
  "8d9e3217-78c8-4864-acf1-f8ff78aed694":
    saminPortrait.url,
};

export const applyTeamImageOverride = (
  memberId: string,
  imageUrl: string | null | undefined,
): string | null | undefined => {
  // A newly uploaded CMS portrait takes precedence over the legacy recovery copy.
  if (imageUrl && !imageUrl.startsWith('https://kiogiyemoqbnuvclneoe.supabase.co/')) {
    return imageUrl;
  }
  return TEAM_IMAGE_OVERRIDES[memberId] ?? imageUrl;
};
