// Temporary image overrides applied on top of the team_members table data.
// Remove an entry once the matching record has been updated in the admin panel.
export const TEAM_IMAGE_OVERRIDES: Record<string, string> = {
  // Samin (AI Manager) — new studio portrait with the light team background.
  "8d9e3217-78c8-4864-acf1-f8ff78aed694":
    "https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/samin-cf53e9af8cf1.png",
};

export const applyTeamImageOverride = (
  memberId: string,
  imageUrl: string | null | undefined,
): string | null | undefined => TEAM_IMAGE_OVERRIDES[memberId] ?? imageUrl;
