"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Setter<T> = (value: T | ((prev: T) => T)) => void;

const subscribers = new Map<string, Set<() => void>>();

function notify(key: string) {
  subscribers.get(key)?.forEach((cb) => cb());
}

function subscribe(key: string, cb: () => void) {
  let set = subscribers.get(key);
  if (!set) {
    set = new Set();
    subscribers.set(key, set);
  }
  set.add(cb);
  return () => {
    set!.delete(cb);
  };
}

export function useLocalStorage<T>(key: string, initial: T): [T, Setter<T>] {
  const [value, setValue] = useState<T>(initial);
  const valueRef = useRef<T>(initial);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        const parsed = JSON.parse(raw) as T;
        valueRef.current = parsed;
        setValue(parsed);
      }
    } catch {
      // ignore
    }
    const unsub = subscribe(key, () => {
      try {
        const raw = window.localStorage.getItem(key);
        const parsed = raw === null ? initial : (JSON.parse(raw) as T);
        valueRef.current = parsed;
        setValue(parsed);
      } catch {
        // ignore
      }
    });
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          const parsed =
            e.newValue === null ? initial : (JSON.parse(e.newValue) as T);
          valueRef.current = parsed;
          setValue(parsed);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      unsub();
      window.removeEventListener("storage", onStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set: Setter<T> = useCallback(
    (next) => {
      const computed =
        typeof next === "function"
          ? (next as (p: T) => T)(valueRef.current)
          : next;
      if (computed === valueRef.current) return;
      valueRef.current = computed;
      try {
        window.localStorage.setItem(key, JSON.stringify(computed));
      } catch {
        // ignore
      }
      setValue(computed);
      notify(key);
    },
    [key]
  );

  return [value, set];
}
