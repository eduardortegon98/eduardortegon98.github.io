import React, { useEffect, useState } from "react";
import { MessageSquareQuote, Star } from "lucide-react";
import { requireSupabase } from "../lib/supabase";

const FeedbackCard = ({ item }) => {
  return (
    <div className="bg-[#2e3337]/90 border border-white/10 rounded-3xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4 text-[#c8ffb0]">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={18}
            fill={i < (item.rating || 0) ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
        ))}
      </div>

      <div className="flex items-start gap-3">
        <MessageSquareQuote className="text-[#8df0c8] mt-1" size={26} />
        <div>
          <p className="text-gray-200 leading-relaxed">{item.message}</p>
          <span className="block mt-4 text-sm text-[#c8ffb0] font-semibold">
            — {item.name}
          </span>
        </div>
      </div>
    </div>
  );
};

const FeedbackList = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchApprovedFeedback() {
      try {
        const { data, error } = await requireSupabase().rpc("list_approved_feedback");

        if (ignore) return;
        if (error) throw error;

        setFeedbackList(data || []);
      } catch (error) {
        if (!ignore) {
          console.error("Error loading feedback:", error);
          setFeedbackList([]);
        }
      } finally {
        if (!ignore) setLoadingFeedback(false);
      }
    }

    fetchApprovedFeedback();

    return () => {
      ignore = true;
    };
  }, []);

  if (loadingFeedback) {
    return (
      <div className="grid gap-6">
        <div className="bg-[#2e3337]/90 border border-white/10 rounded-3xl p-6 text-gray-300">
          Cargando testimonios...
        </div>
      </div>
    );
  }

  if (feedbackList.length === 0) {
    return (
      <div className="grid gap-6">
        <div className="bg-[#2e3337]/90 border border-white/10 rounded-3xl p-6 text-gray-300">
          Aún no hay testimonios aprobados.
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {feedbackList.map((item) => (
        <FeedbackCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default FeedbackList;