import { useEffect, useState } from 'react';

// A local copy of a loaded list, so reordering can update the screen at once (optimistically)
// while the API call runs. Refreshes whenever the loaded data changes.
export default function useLocalList(data) {
  const [items, setItems] = useState(() => data || []);
  useEffect(() => {
    if (data) setItems(data);
  }, [data]);
  return [items, setItems];
}

export function move(list, index, delta) {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
