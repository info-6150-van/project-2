export type ObservationRow = {
  id: string;
  user_id: string;
  object_name: string;
  object_type: string;
  observed_at: string;
  location: string;
  telescope: string;
  notes: string;
  sketch_path: string | null;
  created_at: string;
};
