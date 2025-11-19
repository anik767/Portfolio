"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ModernInput } from "../components/ModernInput";

type ContactCard = {
  title: string;
  value: string;
  description: string;
  icon: string;
  actionType: "email" | "phone" | "link" | "none";
  actionTarget: string;
};

const iconOptions = [
  { label: "Mail", value: "mail" },
  { label: "Phone", value: "phone" },
  { label: "Location", value: "location" },
  { label: "Clock/Response Time", value: "clock" },
];

const actionOptions: ContactCard["actionType"][] = ["email", "phone", "link", "none"];

const emptyCard = (): ContactCard => ({
  title: "",
  value: "",
  description: "",
  icon: "mail",
  actionType: "none",
  actionTarget: "",
});

export default function ContactAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [heading, setHeading] = useState("Get In Touch");
  const [subheading, setSubheading] = useState("");
  const [cards, setCards] = useState<ContactCard[]>([]);

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  async function checkAuthAndLoad() {
    try {
      const res = await fetch("/api/auth/check", { credentials: "include" });
      const data = await res.json();
      if (!data.authenticated) {
        router.push("/admin");
        return;
      }
      await loadContactData();
    } catch (error) {
      console.error("Auth check failed:", error);
      router.push("/admin");
    }
  }

  async function loadContactData() {
    try {
      const res = await fetch("/api/content/contact", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setHeading(data.heading ?? "Get In Touch");
        setSubheading(data.subheading ?? "");
        if (Array.isArray(data.cards)) {
          setCards(
            data.cards.map((card: ContactCard) => ({
              title: card.title ?? "",
              value: card.value ?? "",
              description: card.description ?? "",
              icon: card.icon ?? "mail",
              actionType: card.actionType ?? "none",
              actionTarget: card.actionTarget ?? "",
            }))
          );
        } else {
          setCards([]);
        }
      }
    } catch (error) {
      console.error("Failed to load contact data:", error);
      setError("Failed to load contact data");
    } finally {
      setFetching(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/content/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ heading, subheading, cards }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update contact data");
      }
      await loadContactData();
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Failed to update contact data");
    } finally {
      setLoading(false);
    }
  };

  const addCard = () => setCards((prev) => [...prev, emptyCard()]);
  const updateCard = (index: number, field: keyof ContactCard, value: string | ContactCard["actionType"]) => {
    setCards((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      if (field === "actionType" && value === "none") {
        copy[index].actionTarget = "";
      }
      return copy;
    });
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="inline-flex items-center gap-3 p-6 rounded-2xl bg-white shadow-xl border border-gray-200">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <span className="text-gray-700 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto pt-12 lg:pt-0">
      <div className="bg-gray-900 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white shadow-lg mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
          <span>📬</span>
          <span>Contact Section</span>
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm">Manage Get In Touch content</p>
      </div>

      <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl flex items-center gap-2">
            <span className="text-lg sm:text-xl">⚠️</span>
            <span className="text-sm sm:text-base">{error}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ModernInput
              label="Section Heading"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
            />
            <ModernInput
              label="Section Subtitle"
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Contact Cards</h2>
            <button
              type="button"
              onClick={addCard}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold shadow-md"
            >
              Add Card
            </button>
          </div>

          {cards.length === 0 && (
            <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="font-semibold text-gray-700 mb-2">No contact cards added</p>
              <p className="text-gray-500 text-sm">Click &quot;Add Card&quot; to begin</p>
            </div>
          )}

          <div className="space-y-4">
            {cards.map((card, index) => (
              <div key={index} className="bg-gray-50 rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <p className="font-semibold text-gray-800">Card {index + 1}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <ModernInput
                    label="Title"
                    value={card.title}
                    onChange={(e) => updateCard(index, "title", e.target.value)}
                    required
                  />
                  <ModernInput
                    label="Value"
                    value={card.value}
                    onChange={(e) => updateCard(index, "value", e.target.value)}
                  />
                  <ModernInput
                    label="Description"
                    type="textarea"
                    rows={3}
                    value={card.description}
                    onChange={(e) => updateCard(index, "description", e.target.value)}
                    className="lg:col-span-2"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                      Icon
                    </label>
                    <select
                      value={card.icon}
                      onChange={(e) => updateCard(index, "icon", e.target.value)}
                      className="w-full text-gray-700 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    >
                      {iconOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                      Action Type
                    </label>
                    <select
                      value={card.actionType}
                      onChange={(e) =>
                        updateCard(index, "actionType", e.target.value as ContactCard["actionType"])
                      }
                      className="w-full text-gray-700 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    >
                      {actionOptions.map((option) => (
                        <option key={option} value={option}>
                          {option === "none" ? "No Action" : option.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <ModernInput
                    label="Action Target"
                    value={card.actionTarget}
                    onChange={(e) => updateCard(index, "actionTarget", e.target.value)}
                    placeholder="mailto@example.com / tel:+123..."
                    className="lg:col-span-1 !text-gray-700"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Contact Content"}
          </button>
        </form>
      </div>
    </div>
  );
}


