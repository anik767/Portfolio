'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Service = {
  title: string;
  description: string;
  features: string[];
  icon: string;
  order?: number;
};

export default function ServicesAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [services, setServices] = useState<Service[]>([]);

  const iconOptions = ['code', 'shield', 'heart', 'lightning', 'database'];

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  async function checkAuthAndLoadData() {
    try {
      const res = await fetch("/api/auth/check", { credentials: "include" });
      const data = await res.json();
      if (!data.authenticated) {
        router.push("/admin");
        return;
      }
      loadServices();
    } catch (err) {
      console.error("Auth check failed:", err);
      router.push("/admin");
    }
  }

  async function loadServices() {
    try {
      const res = await fetch("/api/content/services", { credentials: "include" });
      const data = await res.json();
      if (data.success && Array.isArray(data.services)) {
        setServices(data.services);
      }
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setFetching(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/content/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services }),
        credentials: "include",
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to update services");

      alert("Services updated successfully!");
      loadServices();
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const addService = () => {
    setServices([...services, { title: "", description: "", features: [], icon: "code", order: services.length }]);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: keyof Service, value: string | string[]) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const addFeature = (serviceIndex: number) => {
    const updated = [...services];
    updated[serviceIndex].features.push("");
    setServices(updated);
  };

  const removeFeature = (serviceIndex: number, featureIndex: number) => {
    const updated = [...services];
    updated[serviceIndex].features = updated[serviceIndex].features.filter((_, i) => i !== featureIndex);
    setServices(updated);
  };

  const updateFeature = (serviceIndex: number, featureIndex: number, value: string) => {
    const updated = [...services];
    updated[serviceIndex].features[featureIndex] = value;
    setServices(updated);
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
    <div className="max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl mb-6">
        <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-3">
          <span>💼</span>
          <span>Manage Services</span>
        </h1>
        <p className="text-white/90">Add and manage your service offerings</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addService}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <span className="text-xl">➕</span>
              <span>Add Service</span>
            </button>
          </div>

          {services.length === 0 && (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border-2 border-dashed border-gray-300">
              <div className="text-6xl mb-4">💼</div>
              <p className="text-gray-600 font-semibold text-lg mb-2">No services added yet</p>
              <p className="text-gray-400">Click "Add Service" to get started</p>
            </div>
          )}

          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </span>
                    <span>Service {index + 1}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1"
                  >
                    <span>🗑️</span>
                    <span>Remove</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                      Title
                    </label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={e => updateService(index, "title", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-gray-800 bg-white transition-all duration-200"
                      required
                      placeholder="e.g., Web Development"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                      Description
                    </label>
                    <textarea
                      value={service.description}
                      onChange={e => updateService(index, "description", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-gray-800 bg-white transition-all duration-200"
                      required
                      placeholder="Service description..."
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                      Icon
                    </label>
                    <select
                      value={service.icon}
                      onChange={e => updateService(index, "icon", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-gray-800 bg-white transition-all duration-200"
                    >
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-white/50 p-4 rounded-xl border border-purple-200">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-gray-700 font-semibold text-sm uppercase tracking-wide">
                        Features
                      </label>
                      <button
                        type="button"
                        onClick={() => addFeature(index)}
                        className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1"
                      >
                        <span>➕</span>
                        <span>Add Feature</span>
                      </button>
                    </div>
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={e => updateFeature(index, featureIndex, e.target.value)}
                          className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-gray-800 bg-white transition-all duration-200"
                          placeholder="Feature name"
                        />
                        <button
                          type="button"
                          onClick={() => removeFeature(index, featureIndex)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {service.features.length === 0 && (
                      <p className="text-gray-400 text-sm text-center py-2">No features added yet</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="submit" 
            disabled={loading || services.length === 0} 
            className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Update Services</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

