"use client"
import { X } from "lucide-react";
import { ReactNode, useEffect} from "react";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}


export default function Modal({isOpen, onClose, title, children}:ModalProps) {

    useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

  if (!isOpen) return null;


    return(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full  max-w-5xl  rounded-lg bg-white p-6 shadow-lg">
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className=" text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="rounded text-black hover:bg-red-700 hover:text-white cursor-pointer"
            >
              <X />
            </button>

          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
    )
}   