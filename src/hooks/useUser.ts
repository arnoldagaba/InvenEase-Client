import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

import { type PaginationParams, UserService } from "@/services/userService";
import { useAuthStore } from "@/stores/authStore";
import type { UpdateUserDTO } from "@/types/user";

export const useCurrentUser = () => {
	const { accessToken, setUser } = useAuthStore();

	const query = useQuery({
		queryKey: ["currentUser"],
		queryFn: UserService.currentUser,
		enabled: !!accessToken,
	});

	useEffect(() => {
		if (query.data) {
			setUser(query.data.data);
		}
	}, [query.data, setUser]);

	return query;
};

export const useCreateUser = () => {
	return useMutation({
		mutationFn: UserService.createUser,
		onSuccess: (data) => {
			toast.success(data.message);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

export const usePaginatedUsers = ({
	page = 1,
	limit = 10,
	sort,
	search,
}: PaginationParams) => {
	return useQuery({
		queryKey: ["users", page, limit, sort, search],
		queryFn: () => UserService.getPaginatedUsers({ page, limit, sort, search }),
	});
};

export const useCursorUsers = (cursor: string, take: number) => {
	return useQuery({
		queryKey: ["users", cursor, take],
		queryFn: () => UserService.getUsersByCursor({ cursor, take }),
	});
};

export const useUserById = (id: string) => {
	return useQuery({
		queryKey: ["user", id],
		queryFn: () => UserService.getUserById(id),
	});
};

export const useUpdateUser = () => {
	return useMutation({
		mutationFn: ({ id, user }: { id: string; user: UpdateUserDTO }) =>
			UserService.updateUser(id, user),
		onSuccess: (data) => {
			toast.success(data.message);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

export const useDeleteUser = () => {
	return useMutation({
		mutationFn: ({ id, hard }: { id: string; hard?: true }) =>
			UserService.deleteUser(id, hard),
		onSuccess: (data) => {
			toast.success(data.message);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};