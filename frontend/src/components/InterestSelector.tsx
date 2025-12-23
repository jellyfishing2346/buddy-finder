"use client";
import React, { useEffect, useState } from "react";
import axios from "../lib/api";

type Interest = { id: string; name: string };
type UserInterest = { interestId: string; weight?: number };

interface InterestSelectorProps {
  userId: string;
  onSave?: () => void;
}

const InterestSelector: React.FC<InterestSelectorProps> = ({ userId, onSave }) => {
  const [allInterests, setAllInterests] = useState<Interest[]>([]);
  const [selected, setSelected] = useState<UserInterest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("/interests").then(res => setAllInterests(res.data));
    axios.get(`/users/${userId}/interests`).then(res => {
      setSelected(res.data.map((ui: any) => ({ interestId: ui.interestId, weight: ui.weight })));
    });
  }, [userId]);

  const toggleInterest = (interestId: string) => {
    setSelected(sel =>
      sel.some(i => i.interestId === interestId)
        ? sel.filter(i => i.interestId !== interestId)
        : [...sel, { interestId }]
    );
  };

  const saveInterests = async () => {
    setLoading(true);
    await axios.post(`/users/${userId}/interests`, { interests: selected });
    setLoading(false);
    onSave?.();
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Select Your Interests</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {allInterests.map(interest => (
          <button
            key={interest.id}
            className={`px-3 py-1 rounded-full border ${selected.some(i => i.interestId === interest.id) ? "bg-blue-500 text-white" : "bg-gray-100"}`}
            onClick={() => toggleInterest(interest.id)}
            type="button"
          >
            {interest.name}
          </button>
        ))}
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={saveInterests}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Interests"}
      </button>
    </div>
  );
};

export default InterestSelector;
