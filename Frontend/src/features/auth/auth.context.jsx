import { useEffect, useState } from "react";
import { getMe } from "./services/auth.api";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setloading] = useState(true)

    useEffect(() => {
        let isMounted = true;

        const hydrateUser = async () => {
            try {
                const data = await getMe();
                if (isMounted) {
                    setUser(data?.user ?? null);
                }
            } catch {
                if (isMounted) {
                    setUser(null);
                }
            } finally {
                if (isMounted) {
                    setloading(false);
                }
            }
        };

        hydrateUser();

        return () => {
            isMounted = false;
        };
    }, []);


    return(
        <AuthContext.Provider value={{user, setUser, loading, setloading}}>
            {children}
        </AuthContext.Provider>
    )
}
