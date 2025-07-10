import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useMobile({ breakpoint }: { breakpoint: number }) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < breakpoint);
    return () => mql.removeEventListener("change", onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !!isMobile;
}

/* --------------------- shadcn compatibility --------------------- */
export function useIsMobile() {
  return useMobile({ breakpoint: MOBILE_BREAKPOINT });
}
