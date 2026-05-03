"use client";

import { useEffect, useState } from "react";
import type { SelectedMap } from "./storage";

const stack: SelectedMap[] = [];
const subs = new Set<() => void>();

function notify() {
  subs.forEach((cb) => cb());
}

export function pushUndo(snapshot: SelectedMap) {
  stack.push(snapshot);
  if (stack.length > 30) stack.shift();
  notify();
}

export function popUndo(): SelectedMap | undefined {
  const v = stack.pop();
  notify();
  return v;
}

export function clearUndo() {
  stack.length = 0;
  notify();
}

export function useUndoSize(): number {
  const [size, setSize] = useState(0);
  useEffect(() => {
    setSize(stack.length);
    const cb = () => setSize(stack.length);
    subs.add(cb);
    return () => {
      subs.delete(cb);
    };
  }, []);
  return size;
}
