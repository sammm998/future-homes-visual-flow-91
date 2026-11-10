CREATE POLICY "admins read property images"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'property-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));