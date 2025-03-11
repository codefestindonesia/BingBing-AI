import IconHistoryTwentyFour from "@assets/icons/IconHistory24";
import IconLogout from "@assets/icons/IconLogout";
import IconPerson from "@assets/icons/IconPerson";
import useAuthContext from "@hooks/useAuthContext";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface PopupChildrenProps {
    onclick: () => void;
    text: string;
    icon: React.ReactNode;
}

const PopupChildren: React.FC<PopupChildrenProps> = ({ icon, onclick, text }) => {
    return (
        <div onClick={onclick} className="hover:bg-gray-100 cursor-pointer flex gap-2 w-24">
            <div className="size-5">{icon}</div>
            <p>{text}</p>
        </div>
    );
};

interface Props {
    isPopupOpen: boolean;
    closePopup: () => void;
}

const UserPopUp: React.FC<Props> = ({ isPopupOpen, closePopup }) => {
    const navigate = useNavigate();
    const { getIdentity, logout } = useAuthContext();
    const popupRef = useRef<HTMLDivElement>(null);

    const handleOutsideClick = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            closePopup();
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [isPopupOpen]);

    return (
        <div className="flex flex-col absolute top-10 right-0 bg-white w-fit gap-2" ref={popupRef}>
            <PopupChildren text="Profile" icon={<IconPerson />} onclick={() => navigate(`/profile/${getIdentity()?.getPrincipal()}`)} />
            <PopupChildren text="History" icon={<IconHistoryTwentyFour />} onclick={() => navigate('/history')} />
            <PopupChildren text="Log out" icon={<IconLogout />} onclick={logout} />
        </div>
    );
};

export default UserPopUp;
