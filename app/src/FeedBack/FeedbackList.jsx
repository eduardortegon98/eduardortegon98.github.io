import { Localized } from "../i18n/Language";
import React, { useEffect, useState } from "react";
import { MessageSquareQuote, Star } from "lucide-react";
import { databaseErrorMessage } from "../lib/submissions";
import { requireSupabase } from "../lib/supabase";

const FeedbackCard = ({ item }) => {
  return (
    <Localized as="div" className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-[0_8px_24px_rgba(32,58,43,0.06)]">
      <Localized as="div" className="flex items-center gap-2 mb-4 text-[var(--color-accent)]">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={18}
            fill={i < (item.rating || 0) ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
        ))}
      </Localized>

      <Localized as="div" className="flex items-start gap-3">
        <MessageSquareQuote className="text-[var(--color-accent)] mt-1" size={26} />
        <Localized as="div">
          <Localized as="p" translate="no" className="text-[var(--color-text)] leading-relaxed">{item.message}</Localized>
          <Localized as="span" translate="no" className="block mt-4 text-sm text-[var(--color-accent)] font-semibold">
            — {item.name}
          </Localized>
        </Localized>
      </Localized>
    </Localized>
  );
};

const FeedbackList = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loadError, setLoadError] = useState("");
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
          console.error("Error loading feedback", { code: error.code });
          setLoadError(databaseErrorMessage(error, "No pudimos cargar los testimonios. Inténtalo nuevamente más tarde."));
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
      <Localized as="div" className="grid gap-6">
        <Localized as="div" className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 text-[var(--color-text-muted)]">
          Cargando testimonios...
        </Localized>
      </Localized>
    );
  }

  if (loadError) return <Localized as="p" role="alert" className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-[var(--color-text-muted)]">{loadError}</Localized>;

  if (feedbackList.length === 0) {
    return (
      <Localized as="div" className="grid gap-6">
        <Localized as="div" className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 text-[var(--color-text-muted)]">
          Aún no hay testimonios aprobados.
        </Localized>
      </Localized>
    );
  }

  return (
    <Localized as="div" className="grid gap-6">
      {feedbackList.map((item) => (
        <FeedbackCard key={item.id} item={item} />
      ))}
    </Localized>
  );
};

export default FeedbackList;