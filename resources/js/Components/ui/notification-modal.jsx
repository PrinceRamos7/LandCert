import { Dialog, DialogContent } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

export function NotificationModal({ 
    isOpen, 
    onClose, 
    type = "success", 
    title, 
    message, 
    buttonText = "Continue",
    onButtonClick 
}) {
    const getIcon = () => {
        switch (type) {
            case "success":
                return <CheckCircle className="h-16 w-16 text-white" />;
            case "error":
                return <XCircle className="h-16 w-16 text-white" />;
            case "warning":
                return <AlertCircle className="h-16 w-16 text-white" />;
            case "info":
                return <Info className="h-16 w-16 text-white" />;
            default:
                return <CheckCircle className="h-16 w-16 text-white" />;
        }
    };

    const getIconBgColor = () => {
        switch (type) {
            case "success":
                return "bg-emerald-500";
            case "error":
                return "bg-red-500";
            case "warning":
                return "bg-amber-500";
            case "info":
                return "bg-blue-500";
            default:
                return "bg-emerald-500";
        }
    };

    const getButtonColor = () => {
        switch (type) {
            case "success":
                return "bg-emerald-500 hover:bg-emerald-600 text-white";
            case "error":
                return "bg-red-500 hover:bg-red-600 text-white";
            case "warning":
                return "bg-amber-500 hover:bg-amber-600 text-white";
            case "info":
                return "bg-blue-500 hover:bg-blue-600 text-white";
            default:
                return "bg-emerald-500 hover:bg-emerald-600 text-white";
        }
    };

    const handleButtonClick = () => {
        if (onButtonClick) {
            onButtonClick();
        } else {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-0 overflow-hidden border-0 bg-white rounded-2xl shadow-2xl">
                <div className="text-center p-8">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getIconBgColor()} mb-6 shadow-lg`}>
                        {getIcon()}
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        {title}
                    </h2>
                    
                    {/* Message */}
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {message}
                    </p>
                    
                    {/* Button */}
                    <Button
                        onClick={handleButtonClick}
                        className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${getButtonColor()}`}
                    >
                        {buttonText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}