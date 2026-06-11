import { useEffect, useRef, useMemo } from "react";
import { App } from "./core/App";
import { distortions } from "./core/distortions";
import { hyperspeedPresets } from "./hyperspeedPresets";
import "./Hyperspeed.css";

const Hyperspeed = ({ effectOptions = null, isDark = true }) => {
  const hyperspeed = useRef(null);
  const appRef = useRef(null);

  const resolvedOptions = useMemo(() => {
    if (effectOptions) return effectOptions;
    return isDark ? hyperspeedPresets.four : hyperspeedPresets.fourLight;
  }, [isDark, effectOptions]);

  useEffect(() => {
    if (appRef.current) {
      appRef.current.dispose();
      const container = hyperspeed.current;
      if (container) while (container.firstChild) container.removeChild(container.firstChild);
    }

    const container = hyperspeed.current;
    const options = { ...resolvedOptions };
    options.distortion = distortions[options.distortion];

    const myApp = new App(container, options);
    appRef.current = myApp;
    myApp.loadAssets().then(() =>
      myApp.init(
        resolvedOptions.colors.background === 0x000000 &&
        resolvedOptions.colors.roadColor === 0x080808
      )
    );

    return () => appRef.current?.dispose();
  }, [resolvedOptions]);

  return <div ref={hyperspeed} style={{ width: "100%", height: "100%" }} />;
};

export default Hyperspeed;