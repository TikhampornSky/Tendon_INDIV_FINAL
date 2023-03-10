import { useEffect } from "react";
import PanelContainer from "./PanelContainer";

interface IModalProps {
    setIsOpen: (isOpen: boolean) => void;
    children: React.ReactNode;
}

export default function Modal({ setIsOpen, children }: IModalProps) {
    useEffect(() => {
        console.log("Modal is open ")
        return () => {
            console.log("Modal is closed ")
        }
    }, [])

    return (
        <>
            <div className="absolute top-0 left-0 flex h-screen w-screen items-center justify-center bg-fadeBlack" onClick={() => setIsOpen(false)} >
                <PanelContainer>
                    {children}
                </PanelContainer>
            </div>
        </>
    );
}