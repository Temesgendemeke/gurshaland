-- Only allow users to upload to their own folder
CREATE POLICY "Users can upload to their own recipe folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'gurshaland-bucket'
  AND name LIKE 'recipe/' || auth.uid() || '/%'
);


CREATE POLICY "Users can manage their own images"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'gurshaland-bucket'
  AND name LIKE 'recipe/' || auth.uid() || '/%'
)
WITH CHECK (
  bucket_id = 'gurshaland-bucket'
  AND name LIKE 'recipe/' || auth.uid() || '/%'
);



CREATE POLICY "Allow read for all"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'gurshaland-bucket'
  AND name LIKE 'recipe/%'
);


-- Only allow users to upload their own profile picture
CREATE POLICY "Users can upload their own profile picture"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'gurshaland-bucket'
  AND name LIKE 'profile_picture/' || auth.uid() || '-%'
);


CREATE POLICY "Users can manage their own profile picture"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'gurshaland-bucket'
  AND name LIKE 'profile_picture/' || auth.uid() || '-%'
)
WITH CHECK (
  bucket_id = 'gurshaland-bucket'
  AND name LIKE 'profile_picture/' || auth.uid() || '-%'
);


CREATE POLICY "Allow read profile pictures for all"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'gurshaland-bucket'
  AND name LIKE 'profile_picture/%'
);
