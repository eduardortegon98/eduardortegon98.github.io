import { Localized } from "../i18n/Language";
import FeedbackList from "./FeedbackList";
import FeedbackForm from "./FeedbackForm";

const FeedBack = () => {
  return (
    <Localized as="section"
      className="
        w-full
        bg-[var(--color-bg)]
        px-6 py-24
        md:px-12
      "
    >
      <Localized as="div" className="mx-auto max-w-7xl">
        <Localized as="div" className="mb-14 text-center">
          <Localized as="p"
            className="
              mb-4 text-sm uppercase
              tracking-[0.3em]
              text-[var(--color-accent)]
            "
          >
            Feedback
          </Localized>

          <Localized as="h2"
            className="
              mb-4 text-4xl font-extrabold
              text-[var(--color-accent)]
              md:text-5xl
            "
          >
            Lo que opinan nuestros clientes
          </Localized>

          <Localized as="p"
            className="
              mx-auto max-w-2xl
              text-base leading-relaxed
              text-[var(--color-text-muted)]
              md:text-lg
            "
          >
            Nos encanta escuchar a quienes confían en nuestros servicios.
            Comparte tu experiencia y ayúdanos a seguir mejorando.
          </Localized>
        </Localized>

        <Localized as="div"
          className="
            grid grid-cols-1 gap-10
            items-stretch
            lg:grid-cols-2
          "
        >
          <FeedbackList />
          <FeedbackForm />
        </Localized>
      </Localized>
    </Localized>
  );
};

export default FeedBack;
