-- Add translated slug columns for each supported language
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS slug_sv TEXT,
ADD COLUMN IF NOT EXISTS slug_tr TEXT,
ADD COLUMN IF NOT EXISTS slug_ar TEXT,
ADD COLUMN IF NOT EXISTS slug_ru TEXT,
ADD COLUMN IF NOT EXISTS slug_no TEXT,
ADD COLUMN IF NOT EXISTS slug_da TEXT,
ADD COLUMN IF NOT EXISTS slug_fa TEXT,
ADD COLUMN IF NOT EXISTS slug_ur TEXT;

-- Create indexes for faster slug lookups across all languages
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_slug_sv ON properties(slug_sv);
CREATE INDEX IF NOT EXISTS idx_properties_slug_tr ON properties(slug_tr);
CREATE INDEX IF NOT EXISTS idx_properties_slug_ar ON properties(slug_ar);
CREATE INDEX IF NOT EXISTS idx_properties_slug_ru ON properties(slug_ru);
CREATE INDEX IF NOT EXISTS idx_properties_slug_no ON properties(slug_no);
CREATE INDEX IF NOT EXISTS idx_properties_slug_da ON properties(slug_da);
CREATE INDEX IF NOT EXISTS idx_properties_slug_fa ON properties(slug_fa);
CREATE INDEX IF NOT EXISTS idx_properties_slug_ur ON properties(slug_ur);

-- Add comment for documentation
COMMENT ON COLUMN properties.slug_sv IS 'Swedish translated slug';
COMMENT ON COLUMN properties.slug_tr IS 'Turkish translated slug';
COMMENT ON COLUMN properties.slug_ar IS 'Arabic translated slug';
COMMENT ON COLUMN properties.slug_ru IS 'Russian translated slug';
COMMENT ON COLUMN properties.slug_no IS 'Norwegian translated slug';
COMMENT ON COLUMN properties.slug_da IS 'Danish translated slug';
COMMENT ON COLUMN properties.slug_fa IS 'Farsi/Persian translated slug';
COMMENT ON COLUMN properties.slug_ur IS 'Urdu translated slug';