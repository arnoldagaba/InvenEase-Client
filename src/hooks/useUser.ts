import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { UserService } from "@/services/userService";
import { useAuthStore } from "@/stores/authStore";

export const useCurrentUser = () => {
	const { accessToken, setUser } = useAuthStore();

	const query = useQuery({
		queryKey: ["currentUser"],
		queryFn: UserService.currentUser,
		enabled: !!accessToken,
	});

	useEffect(() => {
		if (query.data) {
			setUser(query.data.data.user);
		}
	}, [query.data, setUser]);

	return query;
};
