export type Profile = {
  id: string;
  role: 'user' | 'admin';
  handle: string | null;
  created_at: string;
};
