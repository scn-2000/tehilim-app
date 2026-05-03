import { supabase } from './supabase';

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getUserDisplayName(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return '';
  const meta = user.user_metadata;
  if (meta?.full_name) return meta.full_name;
  if (meta?.name) return meta.name;
  if (meta?.first_name) return `${meta.first_name} ${meta.last_name || ''}`.trim();
  return user.email?.split('@')[0] || '';
}

export async function syncBookmarksToCloud(userId: string) {
  const local = JSON.parse(localStorage.getItem('bookmarks') || '[]') as number[];
  if (local.length === 0) return;
  const inserts = local.map(psalm_num => ({ user_id: userId, psalm_num }));
  await supabase.from('user_bookmarks').upsert(inserts, { onConflict: 'user_id,psalm_num' });
}

export async function loadBookmarksFromCloud(userId: string): Promise<number[]> {
  const { data } = await supabase
    .from('user_bookmarks')
    .select('psalm_num')
    .eq('user_id', userId);
  return data?.map(r => r.psalm_num) || [];
}

export async function addBookmarkToCloud(userId: string, psalmNum: number) {
  await supabase.from('user_bookmarks').upsert({ user_id: userId, psalm_num: psalmNum }, { onConflict: 'user_id,psalm_num' });
}

export async function removeBookmarkFromCloud(userId: string, psalmNum: number) {
  await supabase.from('user_bookmarks').delete().eq('user_id', userId).eq('psalm_num', psalmNum);
}

export async function syncListsToCloud(userId: string) {
  const local = JSON.parse(localStorage.getItem('psalm_lists') || '[]');
  for (const list of local) {
    const { data } = await supabase
      .from('user_lists')
      .upsert({ id: list.id, user_id: userId, name: list.name, description: list.description || '' }, { onConflict: 'id' })
      .select()
      .single();
    if (data) {
      const psalms = list.psalms.map((psalm_num: number) => ({ list_id: list.id, psalm_num }));
      if (psalms.length > 0) {
        await supabase.from('user_list_psalms').upsert(psalms, { onConflict: 'list_id,psalm_num' });
      }
    }
  }
}

export async function loadListsFromCloud(userId: string) {
  const { data: lists } = await supabase
    .from('user_lists')
    .select('*')
    .eq('user_id', userId);
  if (!lists) return [];
  const result = [];
  for (const list of lists) {
    const { data: psalms } = await supabase
      .from('user_list_psalms')
      .select('psalm_num')
      .eq('list_id', list.id);
    result.push({
      id: list.id,
      name: list.name,
      description: list.description || '',
      psalms: psalms?.map((p: { psalm_num: number }) => p.psalm_num) || [],
      createdAt: list.created_at ? new Date(list.created_at).getTime() : Date.now(),
    });
  }
  return result;
}