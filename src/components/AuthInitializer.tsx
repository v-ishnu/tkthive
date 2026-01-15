"use client";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { checkAuth } from "@/store/slices/authslice";

export default function AuthInitializer() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    return null;
}
