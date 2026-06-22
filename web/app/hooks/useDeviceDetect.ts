import { useState, useEffect } from "react";

export default function useDeviceDetect() {
  const [isMobile, setMobile] = useState<boolean>(false);

  useEffect(() => {
    _handleDetect();
    window.addEventListener("resize", _handleDetect);

    return () => window.removeEventListener("resize", _handleDetect);
  }, [setMobile]);

  const _handleDetect = () => {
    const userAgent =
      typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobileUA = Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      )
    );
    const isSmallDevice = window.innerWidth <= 1080;
    // console.log(isSmallDevice, mobileUA)
    setMobile(isSmallDevice ? true : mobileUA);
  };
  // console.log(isMobile)
  return { isMobile };
}
