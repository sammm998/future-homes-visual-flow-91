import {
  Dumbbell, Car, Waves, ArrowUpDown, Cctv, ShieldCheck, Snowflake, Flame, Wifi, Trees, Baby, Bath, CookingPot,
  Lightbulb, Sun, Sofa, BedDouble, Cpu, Blinds, Zap, Droplets, Bike, Gamepad2, Film, Coffee, Store, UtensilsCrossed,
  Dog, KeyRound, Mountain, Building2, Shirt, Thermometer, Sparkles, Trophy, CheckCircle, type LucideIcon,
} from "lucide-react";

/** Ordered keyword rules: first match wins, so specific terms precede generic ones. */
const RULES: [RegExp, LucideIcon][] = [
  [/fitness|gym|training/i, Dumbbell],
  [/parking|garage|car\b/i, Car],
  [/pool|aqua|water ?park|swim/i, Waves],
  [/sauna|steam|hammam|turkish bath|spa|jacuzzi/i, Droplets],
  [/elevator|lift/i, ArrowUpDown],
  [/cctv|camera/i, Cctv],
  [/security|guard|gated|entry|access|intercom/i, ShieldCheck],
  [/air ?condition|a\/c|climat/i, Snowflake],
  [/underfloor|heating|boiler|fireplace/i, Thermometer],
  [/smart home|home automation/i, Cpu],
  [/shutter|blind|curtain/i, Blinds],
  [/generator|electric|charging|ev\b/i, Zap],
  [/wi-?fi|internet|fiber|satellite/i, Wifi],
  [/garden|green|park|landscap/i, Trees],
  [/child|kids|playground|baby/i, Baby],
  [/bathroom|vanity|shower|toilet/i, Bath],
  [/kitchen|appliance|oven/i, CookingPot],
  [/light|led\b|lamp/i, Lightbulb],
  [/solar|sun|terrace|balcon/i, Sun],
  [/tv|cloakroom|wardrobe|furnish|sofa|lounge/i, Sofa],
  [/bed|headboard/i, BedDouble],
  [/laundry|dry ?clean/i, Shirt],
  [/bike|bicycle|cycling/i, Bike],
  [/game|billiard/i, Gamepad2],
  [/cinema|movie|theat/i, Film],
  [/cafe|coffee/i, Coffee],
  [/restaurant|bbq|barbecue/i, UtensilsCrossed],
  [/market|shop|store/i, Store],
  [/pet|dog/i, Dog],
  [/concierge|reception|key/i, KeyRound],
  [/view|mountain|sea/i, Mountain],
  [/tennis|basketball|football|court|sport/i, Trophy],
  [/lobby|building|residence/i, Building2],
  [/luxury|premium|bespoke/i, Sparkles],
];

export function amenityIcon(feature: string): LucideIcon {
  for (const [re, icon] of RULES) if (re.test(feature)) return icon;
  return CheckCircle;
}
