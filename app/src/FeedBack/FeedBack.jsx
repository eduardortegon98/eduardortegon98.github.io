import FeedbackList from "./FeedbackList";
import FeedbackForm from "./FeedbackForm";

const FeedBack = () => {
  return (
    <section
      className="
        w-full
        bg-[var(--color-bg-secondary)]
        px-6 py-24
        md:px-12
      "
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p
            className="
              mb-4 text-sm uppercase
              tracking-[0.3em]
              text-[var(--color-primary)]
            "
          >
            Feedback
          </p>

          <h2
            className="
              mb-4 text-4xl font-extrabold
              text-[var(--color-primary)]
              md:text-5xl
            "
          >
            Lo que opinan nuestros clientes
          </h2>

          <p
            className="
              mx-auto max-w-2xl
              text-base leading-relaxed
              text-[var(--color-text-muted)]
              md:text-lg
            "
          >
            Nos encanta escuchar a quienes confían en nuestros servicios.
            Comparte tu experiencia y ayúdanos a seguir mejorando.
          </p>
        </div>

        <div
          className="
            grid grid-cols-1 gap-10
            items-stretch
            lg:grid-cols-2
          "
        >
          <FeedbackList />
          <FeedbackForm />
        </div>
      </div>
    </section>
  );
};

export default FeedBack;
