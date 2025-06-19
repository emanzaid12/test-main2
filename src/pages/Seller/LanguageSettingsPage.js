import React from "react";
import { FaGlobe, FaMoon } from "react-icons/fa";
import Select from "react-select";
import { useTranslation } from "react-i18next";

// إعداد الخيارات للغات
const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية' },
  // أضف لغات أخرى هنا إذا أردت
];

const LanguageSettingsPage = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-red-800 mb-6">{t("Language & Appearance")}</h1>

        {/* Language Select */}
        <div className="mb-8">
          <label className="block mb-3 font-medium text-gray-700 flex items-center gap-2">
            <FaGlobe className="text-red-800" /> {t("Language")}
          </label>
          <Select
            options={languageOptions}
            value={languageOptions.find(option => option.value === i18n.language)}
            onChange={(selectedOption) => i18n.changeLanguage(selectedOption.value)}
            className="w-60"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#d1d5db",
                borderRadius: "0.375rem",
                padding: "2px",
                boxShadow: "none",
                "&:hover": { borderColor: "#991b1b" },
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected ? "#991b1b" : "white",
                color: state.isSelected ? "white" : "black",
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                },
              }),
              singleValue: (base) => ({
                ...base,
                color: "#1f2937",
              }),
            }}
          />
        </div>

        {/* Dark Mode Switch */}
        <div className="flex items-center gap-2 mt-4">
          <label className="block font-medium text-gray-700 flex items-center gap-2">
            <FaMoon className="text-red-800" /> {t("Dark Mode")}
          </label>
          <label className="relative inline-flex items-center cursor-pointer ml-20">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-red-800 transition-colors duration-300"></div>
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettingsPage;
