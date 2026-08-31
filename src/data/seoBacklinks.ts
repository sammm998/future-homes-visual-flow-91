export type BacklinkCategory =
  | "Social Profile"
  | "Local Work (Sweden)"
  | "Local Work (Norway)"
  | "Article Submission"
  | "Thematic Backlinks";

export interface Backlink {
  url: string;
  target: string;
  status: "Approved" | "Pending";
  category: BacklinkCategory;
  reportDate: string;
}

/** Off-page work report for futurehomesinternational.com — 2026-08-31 */
export const SEO_BACKLINK_REPORT_DATE = "2026-08-31";

export const seoBacklinks: Backlink[] = [
  // Local Work (Sweden)
  { url: "https://cupoworld.se/user/futurehomesinternational", target: "https://futurehomesinternational.com/sv/antalya", status: "Approved", category: "Local Work (Sweden)", reportDate: "2026-08-31" },
  { url: "https://www.betapet.se/user/profile/basic/?userid=833062", target: "https://futurehomesinternational.com/sv/cyprus", status: "Approved", category: "Local Work (Sweden)", reportDate: "2026-08-31" },
  { url: "https://www.bloggportalen.se/BlogPortal/view/BlogDetails?id=332399", target: "https://futurehomesinternational.com/sv/bali", status: "Approved", category: "Local Work (Sweden)", reportDate: "2026-08-31" },
  { url: "https://www.eventbrite.com/o/future-homes-international-121695635816", target: "https://futurehomesinternational.com/sv/bali", status: "Approved", category: "Local Work (Sweden)", reportDate: "2026-08-31" },
  { url: "https://www.byralistan.se/alberga/future-homes-international/", target: "https://futurehomesinternational.com/sv", status: "Approved", category: "Local Work (Sweden)", reportDate: "2026-08-31" },
  { url: "https://www.byggahus.se/forum/members/futurehomesinternational.903814/", target: "https://futurehomesinternational.com/sv", status: "Approved", category: "Local Work (Sweden)", reportDate: "2026-08-31" },
  { url: "https://www.zazzle.se/mbr/238245273796683159", target: "https://futurehomesinternational.com/sv", status: "Approved", category: "Local Work (Sweden)", reportDate: "2026-08-31" },
  { url: "https://thatsup.se/user/future-homes-international/about/", target: "https://futurehomesinternational.com/sv/istanbul", status: "Approved", category: "Local Work (Sweden)", reportDate: "2026-08-31" },
  { url: "https://se.enrollbusiness.com/BusinessProfile/7944708/Future%20Homes%20International", target: "https://futurehomesinternational.com/sv/cyprus", status: "Approved", category: "Local Work (Sweden)", reportDate: "2026-08-31" },
  { url: "https://se.pinterest.com/futurehomesinternational/_profile/", target: "https://futurehomesinternational.com/sv/antalya", status: "Approved", category: "Local Work (Sweden)", reportDate: "2026-08-31" },

  // Local Work (Norway)
  { url: "https://www.lbkb.no/profile/futurehomesinternational99035", target: "https://futurehomesinternational.com/no/antalya", status: "Approved", category: "Local Work (Norway)", reportDate: "2026-08-31" },
  { url: "https://no.enrollbusiness.com/BusinessProfile/7944713/Future%20Homes%20International", target: "https://futurehomesinternational.com/no/antalya", status: "Approved", category: "Local Work (Norway)", reportDate: "2026-08-31" },
  { url: "https://www.hotfrog.no/company/448eabf9ea8552ead3f1ba1e2c067be5", target: "https://futurehomesinternational.com/no", status: "Approved", category: "Local Work (Norway)", reportDate: "2026-08-31" },
  { url: "https://99designs.no/profiles/16940941/about", target: "https://futurehomesinternational.com/no", status: "Approved", category: "Local Work (Norway)", reportDate: "2026-08-31" },
  { url: "https://billetto.no/users/future-homes-international", target: "https://futurehomesinternational.com/no", status: "Approved", category: "Local Work (Norway)", reportDate: "2026-08-31" },

  // Social Profile
  { url: "https://www.mindmeister.com/users/channel/133041180", target: "https://futurehomesinternational.com/sv/antalya", status: "Approved", category: "Social Profile", reportDate: "2026-08-31" },
  { url: "https://gravatar.com/practicallyserene8c14231b85", target: "https://futurehomesinternational.com/sv/dubai", status: "Approved", category: "Social Profile", reportDate: "2026-08-31" },
  { url: "https://pixabay.com/users/futurehomesinternational-57349654/", target: "https://futurehomesinternational.com/sv/cyprus", status: "Approved", category: "Social Profile", reportDate: "2026-08-31" },
  { url: "https://giphy.com/channel/futurehomesinternational", target: "https://futurehomesinternational.com/no/antalya", status: "Approved", category: "Social Profile", reportDate: "2026-08-31" },
  { url: "https://peatix.com/user/30423332/view", target: "https://futurehomesinternational.com/no/dubai", status: "Approved", category: "Social Profile", reportDate: "2026-08-31" },
  { url: "https://www.atlasobscura.com/users/futurehomesinternational", target: "https://futurehomesinternational.com/no/bali", status: "Approved", category: "Social Profile", reportDate: "2026-08-31" },
  { url: "https://ko-fi.com/futurehomesinternational", target: "https://futurehomesinternational.com/no/bali", status: "Approved", category: "Social Profile", reportDate: "2026-08-31" },
  { url: "https://www.futurelearn.com/profiles/23361972", target: "https://futurehomesinternational.com/no", status: "Approved", category: "Social Profile", reportDate: "2026-08-31" },
  { url: "https://community.fandom.com/wiki/User:Futurehomesinternational", target: "https://futurehomesinternational.com/no", status: "Approved", category: "Social Profile", reportDate: "2026-08-31" },
  { url: "https://www.pexels.com/@future-homes-international-2163906691/", target: "https://futurehomesinternational.com/no", status: "Approved", category: "Social Profile", reportDate: "2026-08-31" },

  // Article Submission
  { url: "https://penzu.com/public/0324058ef76514a5", target: "https://futurehomesinternational.com/sv/", status: "Approved", category: "Article Submission", reportDate: "2026-08-31" },
  { url: "https://anotepad.com/note/read/49qtx743", target: "https://futurehomesinternational.com/sv/", status: "Approved", category: "Article Submission", reportDate: "2026-08-31" },
  { url: "https://futurehomesinternational.mystrikingly.com/blog/kjop", target: "https://futurehomesinternational.com/no/", status: "Approved", category: "Article Submission", reportDate: "2026-08-31" },
  { url: "https://articlescad.com/kj-pe-eiendom-i-utlandet-en-praktis", target: "https://futurehomesinternational.com/no/", status: "Approved", category: "Article Submission", reportDate: "2026-08-31" },
  { url: "https://akademinai.se/blogg/ai-i-fastighetsbranschen-future", target: "https://futurehomesinternational.com/sv", status: "Approved", category: "Article Submission", reportDate: "2026-08-31" },
  { url: "https://www.beauto.io/work/real-estate-ai", target: "https://futurehomesinternational.com/", status: "Approved", category: "Article Submission", reportDate: "2026-08-31" },
  { url: "https://pikta.io/", target: "https://futurehomesinternational.com", status: "Approved", category: "Article Submission", reportDate: "2026-08-31" },
  { url: "https://irajsmobel.se/blogg/ai-bostadskop", target: "https://futurehomesinternational.com/sv", status: "Approved", category: "Article Submission", reportDate: "2026-08-31" },
  { url: "https://sapamaison.com/", target: "https://futurehomesinternational.com/", status: "Approved", category: "Article Submission", reportDate: "2026-08-31" },
  { url: "https://icroseo.com/", target: "https://futurehomesinternational.com/", status: "Approved", category: "Article Submission", reportDate: "2026-08-31" },
  { url: "https://maroxoil.eu/", target: "https://futurehomesinternational.com/", status: "Approved", category: "Article Submission", reportDate: "2026-08-31" },

  // Thematic Backlinks
  { url: "https://www.peaksholdingsllc.com/profile/futurehomesinternational32829/profile", target: "https://futurehomesinternational.com/no", status: "Approved", category: "Thematic Backlinks", reportDate: "2026-08-31" },
  { url: "https://www.9flats.com/users/future-homes-i", target: "https://futurehomesinternational.com/no", status: "Approved", category: "Thematic Backlinks", reportDate: "2026-08-31" },
  { url: "https://www.pauljanosrealestate.com/profile/futurehomesinternational42614/profile", target: "https://futurehomesinternational.com/no/dubai", status: "Approved", category: "Thematic Backlinks", reportDate: "2026-08-31" },
  { url: "https://remoterealestate.com/groups/future-homes-international/members/all-members/", target: "https://futurehomesinternational.com/no", status: "Approved", category: "Thematic Backlinks", reportDate: "2026-08-31" },
  { url: "https://overseas-realestate.com/agent/future-homes-international/", target: "https://futurehomesinternational.com/no/cyprus", status: "Approved", category: "Thematic Backlinks", reportDate: "2026-08-31" },
  { url: "https://impactrealtygroup.net/agency/future-homes-international/", target: "https://futurehomesinternational.com/sv", status: "Approved", category: "Thematic Backlinks", reportDate: "2026-08-31" },
  { url: "https://propertyrealestate.world/user/futurehomesinternational/", target: "https://futurehomesinternational.com/sv/dubai", status: "Approved", category: "Thematic Backlinks", reportDate: "2026-08-31" },
];

export function backlinkHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
