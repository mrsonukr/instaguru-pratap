import { Clock } from "lucide-react";
import siteConfig from "../../config/siteConfig";

const PayInfo = () => {
  return (
    <div className="font-semibold text-slate-800 ">
      <h3>Instruction</h3>
      <ul className="list-decimal pl-5 space-y-2 mt-4 text-sm">
        <li>
          Please enter an amount above ₹{siteConfig.minimumAmount} and then click "Pay Now".{" "}
          <span className="text-green-600">(Min {siteConfig.minimumAmount}Rs)</span>
        </li>
        <li>Scan QR Code and Pay</li>
        <li>
          Payments are processed automatically; you don't need to provide UTR
          information.
        </li>
      </ul>

      <div className="flex items-start gap-3 mt-4 bg-sky-50 text-green-800 border border-green-200 rounded-xl p-4">
        <Clock className="w-5 h-5 mt-1 text-green-500" />
        <div className="text-sm leading-relaxed">
          Funds will be added automatically in <strong>1-4 minutes</strong>.
        </div>
      </div>
    </div>
  );
};

export default PayInfo;