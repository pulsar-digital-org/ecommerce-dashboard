import { useTransitionContext } from "@/context/transition-context";

export function usePageTransition() {
	return useTransitionContext();
}
