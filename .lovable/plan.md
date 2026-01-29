

# Plan: Skapa översatta sluggar för alla fastigheter

## Problem
Migrationen som lägger till slug-kolumnerna (`slug_sv`, `slug_tr`, etc.) har skapats men **aldrig körts** mot databasen. Utan dessa kolumner kan `translate-slugs` edge function inte spara översättningarna.

## Lösning

### Steg 1: Köra databasmigrationen
Skapa och kör en ny migration som lägger till de 8 översättningskolumnerna till `properties`-tabellen:
- `slug_sv` (Svenska)
- `slug_tr` (Turkiska)  
- `slug_ar` (Arabiska)
- `slug_ru` (Ryska)
- `slug_no` (Norska)
- `slug_da` (Danska)
- `slug_fa` (Persiska/Farsi)
- `slug_ur` (Urdu)

Plus index på varje kolumn för snabba sökningar.

### Steg 2: Deploya och köra translate-slugs
Efter att kolumnerna finns i databasen:
1. Deploya edge function
2. Anropa den med `background: true` för att översätta alla 189 fastigheter i bakgrunden
3. Varje fastighet × 8 språk = ~1500 översättningar

### Steg 3: Verifiera
Kontrollera att översättningarna sparats korrekt genom att:
1. Fråga databasen efter några fastigheter med deras översatta sluggar
2. Testa att navigera till en fastighet med `?lang=sv` och se att URL:en ändras till `/fastighet/[svensk-slug]`

## Teknisk implementation

### Databasschema (migration)
```sql
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS slug_sv TEXT,
ADD COLUMN IF NOT EXISTS slug_tr TEXT,
ADD COLUMN IF NOT EXISTS slug_ar TEXT,
ADD COLUMN IF NOT EXISTS slug_ru TEXT,
ADD COLUMN IF NOT EXISTS slug_no TEXT,
ADD COLUMN IF NOT EXISTS slug_da TEXT,
ADD COLUMN IF NOT EXISTS slug_fa TEXT,
ADD COLUMN IF NOT EXISTS slug_ur TEXT;

CREATE INDEX IF NOT EXISTS idx_properties_slug_sv ON properties(slug_sv);
CREATE INDEX IF NOT EXISTS idx_properties_slug_tr ON properties(slug_tr);
-- ... etc för alla språk
```

### Edge function anrop
```javascript
// Startar bakgrundsöversättning av alla fastigheter
POST /translate-slugs
Body: { "background": true, "batchSize": 10 }
```

## Tidsuppskattning
- Databasmigrering: Omedelbar
- Översättning: ~5-15 minuter (beroende på API-hastighet)
- Totalt: Alla 189 fastigheter får översatta URL-sluggar på alla 8 språk

## Förväntat resultat
Efter implementation:
- **Engelska**: `/property/modern-apartments-in-antalya`
- **Svenska**: `/fastighet/moderna-lagenheter-i-antalya?lang=sv`
- **Turkiska**: `/mulk/antalyada-modern-daireler?lang=tr`
- **Arabiska**: `/aqar/شقق-حديثة-في-انطاليا?lang=ar`

