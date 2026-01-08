export default function AlertBox({ message, mode = "warning", onClose }) {
  const styles = {
    danger: {
      bg: "bg-red-50",
      border: "border-red-300",
      text: "text-red-800",
      btn: "bg-red-600 hover:bg-red-700",
      icon: "❌"
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-300",
      text: "text-green-800",
      btn: "bg-green-600 hover:bg-green-700",
      icon: "✅"
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-300",
      text: "text-yellow-800",
      btn: "bg-yellow-500 hover:bg-yellow-600",
      icon: "⚠️"
    }
  };

  const theme = styles[mode];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`w-80 rounded-2xl border ${theme.bg} ${theme.border}
                    p-6 shadow-2xl animate-alert`}
      >
        {/* ICON */}
        <div className="text-3xl text-center mb-2">
          {theme.icon}
        </div>

        {/* MESSAGE */}
        <div className={`text-center text-sm font-medium ${theme.text}`}>
          {message}
        </div>

        {/* BUTTON */}
        <div className="flex justify-center mt-5">
          <button
            onClick={onClose}
            className={`px-6 py-1.5 text-sm text-white rounded-full
                        transition-all duration-200
                        active:scale-95 ${theme.btn}`}
          >
            OK
          </button>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        .animate-alert {
          animation: alertIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes alertIn {
          from {
            transform: translateY(20px) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
