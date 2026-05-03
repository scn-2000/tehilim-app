export interface PsalmList {
  id: string;
  name: string;
  description: string;
  psalms: number[];
  createdAt: number;
}

export function getLists(): PsalmList[] {
  try { return JSON.parse(localStorage.getItem('psalm_lists') || '[]'); } catch { return []; }
}

export function saveLists(lists: PsalmList[]) {
  try { localStorage.setItem('psalm_lists', JSON.stringify(lists)); } catch {}
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function createList(name: string, description: string): PsalmList {
  const list: PsalmList = {
    id: generateId(),
    name,
    description,
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
  const data = { name: list.name, description: list.description, psalms: list.psalms };
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

export function decodeSharedList(encoded: string): { name: string; description: string; psalms: number[] } | null {
  try { return JSON.parse(decodeURIComponent(atob(encoded))); } catch { return null; }
}