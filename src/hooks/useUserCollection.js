import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";

export function useUserCollection(entityName) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await base44.entities[entityName].list("-created_date", 200);
      setItems(data || []);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [entityName]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (payload) => {
      setSaving(true);
      try {
        const item = await base44.entities[entityName].create(payload);
        setItems((p) => [item, ...p]);
        return item;
      } finally {
        setSaving(false);
      }
    },
    [entityName]
  );

  const update = useCallback(
    async (id, payload) => {
      setSaving(true);
      try {
        const item = await base44.entities[entityName].update(id, payload);
        setItems((p) => p.map((x) => (x.id === id ? { ...x, ...item } : x)));
        return item;
      } finally {
        setSaving(false);
      }
    },
    [entityName]
  );

  const remove = useCallback(
    async (id) => {
      setSaving(true);
      try {
        await base44.entities[entityName].delete(id);
        setItems((p) => p.filter((x) => x.id !== id));
      } finally {
        setSaving(false);
      }
    },
    [entityName]
  );

  return { items, loading, saving, create, update, remove, reload: load };
}