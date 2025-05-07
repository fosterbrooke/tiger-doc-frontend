import { AppDispatch } from "../redux/store";
import { hideHeader, showHeader } from "../redux/userSlice";

export const updateHeaderVisibility = (
    currentPath: string,
    dispatch: AppDispatch
) => {
    const noHeaderFooterRoutes = ['/login', '/signup', '/404'];
    const shouldHideHeaderFooter = noHeaderFooterRoutes.some((route) =>
        currentPath.startsWith(route)
    );

    if (shouldHideHeaderFooter) {
        dispatch(hideHeader());
    } else {
        dispatch(showHeader());
    }
};