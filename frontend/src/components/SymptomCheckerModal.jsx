import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const SymptomCheckerModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    symptoms: "",
    duration: "",
    height: "",
    weight: "",
    bloodType: "",
    gender: "",
  });

  const steps = [
    { id: 1, title: "Keluhan" },
    { id: 2, title: "Durasi" },
    { id: 3, title: "Informasi Dasar" },
  ];

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleAnalysis = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-fade-in shadow-2xl">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl transition-all duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-white dark:bg-[#0B1221] rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-outline-variant/20 overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        {/* Header / Progress */}
        <div className="p-8 pb-4 border-b border-slate-100 dark:border-outline-variant/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">{step}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight">
                {steps[step - 1].title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out shadow-glow-primary"
              style={{ width: `${(step / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Body / Form Content */}
        <div className="flex-1 overflow-y-auto p-10">
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-2 tracking-tight">
                Apa yang kamu rasakan?
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
                Ceritakan keluhan kesehatan kamu selengkap mungkin.
              </p>
              <textarea
                autoFocus
                className="w-full h-48 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-outline-variant/20 rounded-2xl p-6 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-medium resize-none shadow-inner"
                placeholder="Contoh: Sudah 2 hari saya merasa demam dan batuk berdahak di malam hari..."
                value={formData.symptoms}
                onChange={(e) =>
                  setFormData({ ...formData, symptoms: e.target.value })
                }
              />
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-2 tracking-tight">
                Sudah berapa lama?
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
                Pilih durasi keluhan yang kamu alami.
              </p>
              <div className="grid grid-cols-1 gap-4">
                {[
                  "Baru saja / < 24 jam",
                  "2 - 3 Hari",
                  "1 Minggu",
                  "> 1 Minggu",
                ].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setFormData({ ...formData, duration: opt });
                      nextStep();
                    }}
                    className={`w-full p-6 rounded-2xl text-left border-2 transition-all font-bold group ${formData.duration === opt ? "border-primary bg-primary/5 text-primary" : "border-slate-100 dark:border-outline-variant/20 hover:border-primary/30 text-slate-700 dark:text-slate-300"}`}
                  >
                    <div className="flex items-center justify-between">
                      {opt}
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.duration === opt ? "bg-primary border-primary" : "border-slate-300 dark:border-outline-variant/20 group-hover:border-primary/50"}`}
                      >
                        {formData.duration === opt && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-2 tracking-tight">
                  Informasi Dasar
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
                  Data ini membantu AI memberikan analisis yang lebih akurat.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">
                    Tinggi (cm)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-outline-variant/20 rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-primary/50 font-bold"
                    placeholder="170"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">
                    Berat (kg)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-outline-variant/20 rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-primary/50 font-bold"
                    placeholder="65"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">
                    Gol. Darah
                  </label>
                  <select
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-outline-variant/20 rounded-xl px-4 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-primary/50 font-bold appearance-none cursor-pointer"
                    value={formData.bloodType}
                    onChange={(e) =>
                      setFormData({ ...formData, bloodType: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      Pilih
                    </option>
                    {["A", "B", "AB", "O"].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">
                    Kelamin
                  </label>
                  <select
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-outline-variant/20 rounded-xl px-4 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-primary/50 font-bold appearance-none cursor-pointer"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      Pilih
                    </option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer / Controls */}
        <div className="p-10 pt-4 flex gap-4">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="flex-1 py-5 rounded-2xl border-2 border-slate-100 dark:border-outline-variant/20 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
            >
              Kembali
            </button>
          )}
          <button
            onClick={step === steps.length ? handleAnalysis : nextStep}
            disabled={step === 1 && !formData.symptoms}
            className={`flex-[2] py-5 rounded-2xl font-bold transition-all shadow-xl active:scale-95 ${step === 1 && !formData.symptoms ? "bg-slate-200 dark:bg-white/10 text-slate-400 cursor-not-allowed shadow-none" : "bg-primary text-white hover:bg-primary/90 shadow-primary/25"}`}
          >
            {step === steps.length ? "Analisis Sekarang" : "Lanjut"}
          </button>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-up { from { opacity: 0; transform: translateY(30px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
                .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
                .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .shadow-glow-primary { box-shadow: 0 0 15px rgba(20, 184, 166, 0.4); }
            `,
        }}
      />
    </div>
  );
};

SymptomCheckerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SymptomCheckerModal;
