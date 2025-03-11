interface Props {
  icon: React.ReactNode;
  onclick?: (event: React.MouseEvent) => void;
}

const NavbarIcon: React.FC<Props> = ({ icon, onclick }) => {
  return (
    <button onClick={onclick} className="flex size-6 cursor-pointer items-center justify-center">
      {icon}
    </button>
  );
};

export default NavbarIcon;
