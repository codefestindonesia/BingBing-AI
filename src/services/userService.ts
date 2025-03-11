import useServiceContext from "@hooks/useServiceContext";

export function getUserQuery() {
    const { useQueryCall: userQuery } = useServiceContext().userService;

    const { call: getUser, loading: getUserLoading } = userQuery({
        functionName: "getUser",
        refetchOnMount: false,
        refetchInterval: 0
    })
    return { getUser, getUserLoading };
}

export function createUserUpdate() {
    const { useUpdateCall: userUpdate } = useServiceContext().userService;

    const { call: createUser } = userUpdate({
        functionName: "createUser",
    });

    return { createUser };
}

export function editUserUpdate() {
    const { useUpdateCall: userUpdate } = useServiceContext().userService;

    const { call: editUser } = userUpdate({
        functionName: "updateUser",
    });

    return { editUser };
}