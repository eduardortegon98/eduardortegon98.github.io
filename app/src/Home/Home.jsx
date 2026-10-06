import { Localized } from "../i18n/Language";
// src/Home/Home.jsx

import { Suspense, lazy, memo } from "react";
import useInViewOnce from "../hooks/useInViewOnce";

const Header = lazy(() => import("../Header/Header.jsx"));
const Hero = lazy(() => import("../Hero/Hero.jsx"));
const Products = lazy(() => import("../Products/Products.jsx"));
const Stack = lazy(() => import("../Stack/Stack.jsx"));
const Projects = lazy(() => import("../Projects/Projects.jsx"));
const Footer = lazy(() => import("../Footer/Footer.jsx"));
const Walkie = lazy(() => import("../Walkie/Walkie.jsx"));
const FeedBack = lazy(() => import("../FeedBack/FeedBack.jsx"));
const Quotes = lazy(() => import("../Quote/Quotes.jsx"));

const DeferredSection = memo(function DeferredSection({
  children,
  minHeight = 400,
  rootMargin = "250px 0px",
  id,
}) {
  const { ref, inView } = useInViewOnce({ rootMargin });

  return (
    <Localized as="section" id={id} ref={ref} style={{ minHeight }}>
      {inView ? <Suspense fallback={null}>{children}</Suspense> : null}
    </Localized>
  );
});

function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <Header />
        <Hero />
      </Suspense>

      <DeferredSection id="products" minHeight={720} rootMargin="300px 0px">
        <Products />
      </DeferredSection>

      <DeferredSection minHeight={720} rootMargin="300px 0px">
        <Stack />
      </DeferredSection>

      <DeferredSection minHeight={720} rootMargin="300px 0px">
        <Projects />
      </DeferredSection>

      <DeferredSection minHeight={520} rootMargin="220px 0px">
        <FeedBack />
      </DeferredSection>

      {/* <DeferredSection minHeight={520} rootMargin="220px 0px">
        <Quotes />
      </DeferredSection> */}

      <Suspense fallback={null}>
        <Footer />
        <Walkie />
      </Suspense>
    </>
  );
}

export default Home;
