import { useAuth } from "../context/UseAuth";
import LoginModal from "../pages/Login/LoginModal";
import RegisterModal from "../pages/Register/RegisterModal";

const AuthModals = () => {
  const {
    showLogin,
    closeLoginModal,
    showregister,
    closeRegisterModal,
    openRegisterModal,
    openLoginModal,
  } = useAuth();

  return (
    <>
      <LoginModal
        isOpen={showLogin}
        onClose={closeLoginModal}
        openRegisterModal={openRegisterModal}
      />

      <RegisterModal
        isOpen={showregister}
        onClose={closeRegisterModal}
        openLoginModal={openLoginModal}
      />
    </>
  );
};

export default AuthModals;