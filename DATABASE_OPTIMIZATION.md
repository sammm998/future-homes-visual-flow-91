# Database Optimization Guide for Supabase

## Recommended Database Indexes

Add these indexes to improve query performance:

### Properties Table
```sql
-- Index for location-based queries
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties (location);

-- Index for price range queries
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties (price);

-- Composite index for filtered searches
CREATE INDEX IF NOT EXISTS idx_properties_search 
ON properties (location, property_type, status);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_properties_title_search 
ON properties USING GIN (to_tsvector('english', title || ' ' || description));
```

### Testimonials Table
```sql
-- Index for sorting by creation date
CREATE INDEX IF NOT EXISTS idx_testimonials_created 
ON testimonials (created_at DESC);

-- Index for rating queries
CREATE INDEX IF NOT EXISTS idx_testimonials_rating 
ON testimonials (rating DESC);
```

### Team Members Table
```sql
-- Index for active members
CREATE INDEX IF NOT EXISTS idx_team_active 
ON team_members (is_active, display_order);
```

### Website Content Table
```sql
-- Index for page slug lookups
CREATE INDEX IF NOT EXISTS idx_website_content_slug 
ON website_content (page_slug);
```

## Query Optimization Tips

1. **Use EXPLAIN ANALYZE** to check query performance:
```sql
EXPLAIN ANALYZE 
SELECT * FROM properties WHERE location = 'Antalya';
```

2. **Limit result sets** - Always use LIMIT for paginated queries

3. **Select only needed columns** - Avoid SELECT *

4. **Use RLS efficiently** - Disable for public read-only tables if possible

## Caching Strategy

1. **Frontend caching**: Already configured in React Query (5 min staleTime)
2. **CDN caching**: Configure Cache-Control headers in Supabase Edge Functions
3. **Database query caching**: Use Supabase's built-in query cache

## Monitoring

Check Supabase Dashboard → Performance → Query Performance to identify slow queries.
