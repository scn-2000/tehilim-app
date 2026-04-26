export interface PsalmList {
  id: string;
  name: string;
  psalms: number[];
  createdAt: number;
}

export function getLists(): PsalmList[] {
  try { return JSON.parse(localStorage.getItem('psalm_lists') || '[]'); } catch { return []; }
}

export function saveLists(lists: PsalmList[]) {
  try { localStorage.setItem('psalm_lists', JSON.stringify(lists)); } catch {}
}

export function createList(name: string): PsalmList {
  const list: PsalmList = {
    id: Math.random().toString(36).slice(2, 10),
    name,
    psalms: [],
    createdAt: Date.now(),
  };
  const lists = getLists();
  lists.push(list);
  saveLists(lists);
  return list;
}

export function deleteList(id: string) {
  saveLists(getLists().filter(l => l.id !== id));
}

export function addPsalmToList(listId: string, psalmNum: number) {
  const lists = getLists();
  const list = lists.find(l => l.id === listId);
  if (list && !list.psalms.includes(psalmNum)) {
    list.psalms.push(psalmNum);
    saveLists(lists);
  }
}

export function removePsalmFromList(listId: string, psalmNum: number) {
  const lists = getLists();
  const list = lists.find(l => l.id === listId);
  if (list) {
    list.psalms = list.psalms.filter(p => p !== psalmNum);
    saveLists(lists);
  }
}

export function encodeListForSharing(list: PsalmList): string {
  const data = { name: list.name, psalms: list.psalms };
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

export function decodeSharedList(encoded: string): { name: string; psalms: number[] } | null {
  try { return JSON.parse(decodeURIComponent(atob(encoded))); } catch { return null; }
}