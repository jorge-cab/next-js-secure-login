import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const rolePageMap = {
    admin: ["/admin", "/dashboard"],
    user: ["/dashboard", "/userpage"],
};

function isAuthorizedRole(role, url) {
    return rolePageMap[role]?.includes(url);
}

export default withAuth(
    function middleware(req) {
        if (!isAuthorizedRole(req.nextauth.token?.role, req.nextUrl.pathname)) {
            return NextResponse.rewrite(
                new URL("/unauthorized", req.url)
            );
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = { matcher: ["/admin", "/dashboard", "/userpage"] };
