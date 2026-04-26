import { supabase } from './supabase';

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function signOut() {
  await supabase.auth.signOut();
}

// Sync local bookmarks to cloud
export async function syncBookmarksToCloud(userId: string) {
  const local = JSON.parse(localStorage.getItem('bookmarks') || '[]') as number[];
  if (local.length === 0) return;
  const inserts = local.map(psalm_num => ({ user_id: userId, psalm_num }));
  await supabase.from('user_bookmarks').upsert(inserts, { onConflict: 'user_id,psalm_num' });
}

// Load bookmarks from cloud
export async function loadBookmarksFromCloud(userId: string): Promise<number[]> {
  const { data } = await supabase
    .from('user_bookmarks')
    .select('psalm_num')
    .eq('user_id', userId);
  return data?.map(r => r.psalm_num) || [];
}

// Add bookmark to cloud
export async function addBookmarkToCloud(userId: string, psalmNum: number) {
  await supabase.from('user_bookmarks').upsert({ user_id: userId, psalm_num: psalmNum }, { onConflict: 'user_id,psalm_num' });
}

// Remove bookmark from cloud
export async function removeBookmarkFromCloud(userId: string, psalmNum: number) {
  await supabase.from('user_bookmarks').delete().eq('user_id', userId).eq('psalm_num', psalmNum);
}

// Sync local lists to cloud
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

// Load lists from cloud
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
    result.push({ ...list, psalms: psalms?.map(p => p.psalm_num) || [] });
  }
  return result;
}