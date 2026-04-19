"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Kategorie = "wochenkarte" | "kuchenUndGebaeck" | "getraenke";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  vegan: boolean;
  vegetarisch: boolean;
  glutenfrei: boolean;
  kategorie: Kategorie;
};

type FormData = Omit<MenuItem, "id">;

const TABS: { key: Kategorie; label: string }[] = [
  { key: "wochenkarte", label: "Wochenkarte" },
  { key: "kuchenUndGebaeck", label: "Kuchen & Gebäck" },
  { key: "getraenke", label: "Getränke" },
];

const EMPTY_FORM: FormData = {
  name: "",
  description: "",
  price: "",
  vegan: false,
  vegetarisch: false,
  glutenfrei: false,
  kategorie: "wochenkarte",
};

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-block text-xs font-dm px-2 py-0.5 rounded-full bg-sage/20 text-sage border border-sage/30">
      {label}
    </span>
  );
}

function ItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="border border-sand rounded-xl p-4 bg-white flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-playfair text-espresso text-base truncate">{item.name}</h3>
          <p className="font-dm text-xs text-espresso/50 mt-0.5 line-clamp-2">{item.description}</p>
        </div>
        <p className="font-playfair text-terracotta text-sm font-semibold whitespace-nowrap">{item.price}</p>
      </div>
      <div className="flex gap-1 flex-wrap">
        {item.vegan && <Badge label="Vegan" />}
        {item.vegetarisch && <Badge label="Vegetarisch" />}
        {item.glutenfrei && <Badge label="Glutenfrei" />}
      </div>
      <div className="flex gap-2 mt-1">
        <button
          onClick={() => onEdit(item)}
          className="flex-1 text-xs font-dm py-1.5 rounded-lg border border-sand hover:border-terracotta hover:text-terracotta transition-colors"
        >
          Bearbeiten
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="flex-1 text-xs font-dm py-1.5 rounded-lg border border-sand hover:border-red-400 hover:text-red-500 transition-colors"
        >
          Löschen
        </button>
      </div>
    </div>
  );
}

function Modal({
  form,
  editingId,
  saving,
  saveError,
  onChange,
  onSave,
  onClose,
}: {
  form: FormData;
  editingId: string | null;
  saving: boolean;
  saveError: string;
  onChange: (form: FormData) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-sand">
          <h2 className="font-playfair text-xl text-espresso">
            {editingId ? "Gericht bearbeiten" : "Neues Gericht"}
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block font-dm text-sm text-espresso/70 mb-1">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => onChange({ ...form, name: e.target.value })}
              className="w-full border border-sand rounded-lg px-3 py-2 font-dm text-sm text-espresso focus:outline-none focus:border-terracotta transition-colors"
            />
          </div>
          <div>
            <label className="block font-dm text-sm text-espresso/70 mb-1">Beschreibung *</label>
            <textarea
              value={form.description}
              onChange={(e) => onChange({ ...form, description: e.target.value })}
              rows={2}
              className="w-full border border-sand rounded-lg px-3 py-2 font-dm text-sm text-espresso focus:outline-none focus:border-terracotta transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block font-dm text-sm text-espresso/70 mb-1">Preis *</label>
            <div className="flex items-center border border-sand rounded-lg focus-within:border-terracotta transition-colors">
              <input
                type="text"
                value={form.price}
                onChange={(e) => onChange({ ...form, price: e.target.value })}
                placeholder="9,90"
                className="flex-1 px-3 py-2 font-dm text-sm text-espresso focus:outline-none bg-transparent rounded-l-lg"
              />
              <span className="px-3 font-dm text-sm text-espresso/40">€</span>
            </div>
          </div>
          <div>
            <label className="block font-dm text-sm text-espresso/70 mb-2">Kategorie *</label>
            <select
              value={form.kategorie}
              onChange={(e) => onChange({ ...form, kategorie: e.target.value as Kategorie })}
              className="w-full border border-sand rounded-lg px-3 py-2 font-dm text-sm text-espresso focus:outline-none focus:border-terracotta transition-colors bg-white"
            >
              {TABS.map((t) => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="font-dm text-sm text-espresso/70 mb-2">Eigenschaften</p>
            <div className="flex flex-col gap-2">
              {(["vegan", "vegetarisch", "glutenfrei"] as const).map((flag) => (
                <label key={flag} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form[flag]}
                    onChange={(e) => onChange({ ...form, [flag]: e.target.checked })}
                    className="w-4 h-4 accent-terracotta"
                  />
                  <span className="font-dm text-sm text-espresso capitalize">{flag}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-sand flex gap-3 justify-end items-center">
          {saveError && (
            <p className="font-dm text-xs text-red-600 mr-auto">{saveError}</p>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 font-dm text-sm text-espresso/60 hover:text-espresso transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-5 py-2 bg-terracotta text-white font-dm text-sm rounded-lg hover:bg-[#b3623c] transition-colors disabled:opacity-50"
          >
            {saving ? "Speichern…" : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeTab, setActiveTab] = useState<Kategorie>("wochenkarte");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const router = useRouter();

  const loadItems = useCallback(async () => {
    const res = await fetch("/api/menu");
    if (res.ok) setItems(await res.json());
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, kategorie: activeTab });
    setModalOpen(true);
  }

  function openEdit(item: MenuItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price.replace(/\s*€\s*$/, ""),
      vegan: item.vegan,
      vegetarisch: item.vegetarisch,
      glutenfrei: item.glutenfrei,
      kategorie: item.kategorie,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.description.trim() || !form.price.trim()) return;
    setSaving(true);
    setSaveError("");
    const priceWithEuro = form.price.trim().endsWith("€")
      ? form.price.trim()
      : `${form.price.trim()} €`;
    const formToSend = { ...form, price: priceWithEuro };
    try {
      if (editingId) {
        const res = await fetch(`/api/menu/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formToSend),
        });
        if (res.ok) {
          const updated: MenuItem = await res.json();
          setItems((prev) => prev.map((i) => (i.id === editingId ? updated : i)));
          setModalOpen(false);
        } else {
          const err = await res.json().catch(() => ({}));
          setSaveError(`Fehler ${res.status}: ${err.error ?? "Unbekannt"}`);
        }
      } else {
        const res = await fetch("/api/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formToSend),
        });
        if (res.ok) {
          const created: MenuItem = await res.json();
          setItems((prev) => [...prev, created]);
          setActiveTab(created.kategorie);
          setModalOpen(false);
        } else {
          const err = await res.json().catch(() => ({}));
          setSaveError(`Fehler ${res.status}: ${err.error ?? "Unbekannt"}`);
        }
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
    setDeleteConfirm(null);
  }

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin");
  }

  const tabItems = items.filter((i) => i.kategorie === activeTab);

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-sand px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="font-dm text-sm text-espresso/50 hover:text-terracotta transition-colors"
          >
            ← Zur Website
          </Link>
          <h1 className="font-playfair text-xl text-espresso">Trebelcafé Admin</h1>
        </div>
        <button
          onClick={handleLogout}
          className="font-dm text-sm text-espresso/50 hover:text-espresso transition-colors"
        >
          Abmelden
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-sand mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`font-dm text-sm px-4 py-2.5 border-b-2 transition-colors -mb-px ${
                activeTab === tab.key
                  ? "border-terracotta text-terracotta"
                  : "border-transparent text-espresso/50 hover:text-espresso"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content header */}
        <div className="flex items-center justify-between mb-6">
          <p className="font-dm text-sm text-espresso/50">
            {tabItems.length} {tabItems.length === 1 ? "Eintrag" : "Einträge"}
          </p>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-terracotta text-white font-dm text-sm rounded-lg hover:bg-[#b3623c] transition-colors"
          >
            <span>+</span>
            <span>Neues Gericht</span>
          </button>
        </div>

        {/* Item grid */}
        {tabItems.length === 0 ? (
          <p className="font-dm text-espresso/40 text-center py-12">
            Noch keine Einträge in dieser Kategorie.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tabItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={openEdit}
                onDelete={setDeleteConfirm}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {modalOpen && (
        <Modal
          form={form}
          editingId={editingId}
          saving={saving}
          saveError={saveError}
          onChange={setForm}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setSaveError(""); }}
        />
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-playfair text-lg text-espresso mb-2">Gericht löschen?</h3>
            <p className="font-dm text-sm text-espresso/60 mb-6">
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 font-dm text-sm text-espresso/60 hover:text-espresso transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-5 py-2 bg-red-500 text-white font-dm text-sm rounded-lg hover:bg-red-600 transition-colors"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
