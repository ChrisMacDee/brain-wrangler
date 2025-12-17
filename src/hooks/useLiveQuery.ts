import { useEffect, useState } from "react";
import type { Subscription } from "dexie";

export function useLiveQuery<T>(subscribe: (set: (v: T) => void) => Subscription, initial: T) {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    const sub = subscribe(setValue);
    return () => sub.unsubscribe();
  }, [subscribe]);

  return value;
}
