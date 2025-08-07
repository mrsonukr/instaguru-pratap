import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoadingButton = ({
  link,
  btnName = "Click Here",
  color = "green",
  height = "48px",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (isLoading) return;

    setIsLoading(true);
    setTimeout(() => {
      navigate(link);
    }, 2000);
  };

  // Generate bg color classes dynamically for Tailwind
  // fallback to green if color unknown
  const bgColor = {
    green: "bg-green-500 hover:bg-green-600",
    red: "bg-red-500 hover:bg-red-600",
    blue: "bg-blue-500 hover:bg-blue-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
  }[color] || "bg-green-500 hover:bg-green-600";

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`w-full text-white font-semibold py-2 rounded-md flex justify-center items-center transition-colors duration-200 ${
        isLoading ? "opacity-90 cursor-not-allowed" : bgColor
      }`}
      style={{ minHeight: height }}
    >
      <div className="h-5 flex items-center justify-center">
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-white" strokeWidth={3} />
        ) : (
          <span>{btnName}</span>
        )}
      </div>
    </button>
  );
};

export default LoadingButton;
