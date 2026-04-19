import Lottie from "lottie-react";
import logoAnimation from "../assets/animations/logo-animation.json";

const LottieLogo = ({ className = "w-8 h-8", loop = true, autoplay = true }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Lottie
        animationData={logoAnimation}
        loop={loop}
        autoplay={autoplay}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default LottieLogo;
