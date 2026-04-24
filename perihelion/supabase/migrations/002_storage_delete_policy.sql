-- Allow authenticated users to delete their own sketch objects (same folder rule as insert) --

create policy "Users delete own sketches"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'observation-sketches'
    and (storage.foldername (name))[1] = auth.uid()::text
  );
