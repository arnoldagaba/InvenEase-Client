import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useLogout } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";

const Navbar = () => {
	const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
	const { user, clearAuth } = useAuthStore();
	const { mutateAsync } = useLogout();
	const router = useRouter();

	const handleLogout = async () => {
		await mutateAsync();
		clearAuth();
		router.navigate({ to: "/login", replace: true });
	};

	return (
		<div className="bg-white border-b border-gray-200 px-6 py-4">Navbar</div>
	);
};

export default Navbar;
