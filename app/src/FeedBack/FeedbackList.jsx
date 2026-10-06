import React, { useEffect, useState } from "react";
import { MessageSquareQuote, Star } from "lucide-react";
import { requireSupabase } from "../lib/supabase";

const FeedbackCard = ({ item }) => {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-[0_8px_24px_rgba(32,58,43,0.06)]">
      <div className="flex items-center gap-2 mb-4 text-[var(--color-accent)]">
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
        <MessageSquareQuote className="text-[var(--color-accent)] mt-1" size={26} />
        <div>
          <p className="text-gray-200 leading-relaxed">{item.message}</p>
          <span className="block mt-4 text-sm text-[var(--color-accent)] font-semibold">
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
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 text-[var(--color-text-muted)]">
          Cargando testimonios...
        </div>
      </div>
    );
  }

  if (feedbackList.length === 0) {
    return (
      <div className="grid gap-6">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 text-[var(--color-text-muted)]">
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