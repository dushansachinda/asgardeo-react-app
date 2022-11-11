/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Hooks, useAuthContext } from "@asgardeo/auth-react";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { default as authConfig } from "../config.json";
import REACT_LOGO from "../images/react-logo.png";
import { DefaultLayout } from "../layouts/default";
import { AuthenticationResponse } from "../components";
import { RequestGramaCertResponse } from "../components";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    useLocation,
    Link,
} from "react-router-dom";
import { LogoutRequestDenied } from "../components/LogoutRequestDenied";
import { USER_DENIED_LOGOUT } from "../constants/errors";

/**
 * Decoded ID Token Response component Prop types interface.
 */
type HomePagePropsInterface = {};

/**
 * Home page for the Sample.
 *
 * @param {HomePagePropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const HomePage: FunctionComponent<HomePagePropsInterface> = (): ReactElement => {

    const {
        state,
        signIn,
        signOut,
        getBasicUserInfo,
        getIDToken,
        getDecodedIDToken,
        on
    } = useAuthContext();

    const [derivedAuthenticationState, setDerivedAuthenticationState] = useState<any>(null);
    const [hasAuthenticationErrors, setHasAuthenticationErrors] = useState<boolean>(false);
    const [hasLogoutFailureError, setHasLogoutFailureError] = useState<boolean>();

    const search = useLocation().search;
    const stateParam = new URLSearchParams(search).get('state');
    const errorDescParam = new URLSearchParams(search).get('error_description');

    useEffect(() => {

        if (!state?.isAuthenticated) {
            return;
        }

        (async (): Promise<void> => {
            const basicUserInfo = await getBasicUserInfo();
            const idToken = await getIDToken();
            const decodedIDToken = await getDecodedIDToken();

            const derivedState = {
                authenticateResponse: basicUserInfo,
                idToken: idToken.split("."),
                decodedIdTokenHeader: JSON.parse(atob(idToken.split(".")[0])),
                decodedIDTokenPayload: decodedIDToken
            };

            setDerivedAuthenticationState(derivedState);
        })();
    }, [state.isAuthenticated]);

    useEffect(() => {
        if (stateParam && errorDescParam) {
            if (errorDescParam === "End User denied the logout request") {
                setHasLogoutFailureError(true);
            }
        }
    }, [stateParam, errorDescParam]);

    /**
      * handles the error occurs when the logout consent page is enabled
      * and the user clicks 'NO' at the logout consent page
      */
    useEffect(() => {
        on(Hooks.SignOut, () => {
            setHasLogoutFailureError(false);
        });

        on(Hooks.SignOutFailed, () => {
            if (!errorDescParam) {
                handleLogin();
            }
        })
    }, [on]);

    const handleLogin = () => {
        setHasLogoutFailureError(false);
        signIn()
            .catch(() => setHasAuthenticationErrors(true));
    };

    const handleLogout = () => {
        signOut();
    };

    const handlePoliceReport = () => {
        signOut();
    };

    // If `clientID` is not defined in `config.json`, show a UI warning. 
    if (!authConfig?.clientID) {

        return (
            <div className="content">
                <h2>You need to update the Client ID to proceed.</h2>
                <p>Please open "src/config.json" file using an editor, and update
                    the <code>clientID</code> value with the registered application's client ID.</p>
                <p>Visit repo <a
                    href="https://github.com/asgardeo/asgardeo-auth-react-sdk/tree/master/samples/asgardeo-react-app">README</a> for
                    more details.</p>
            </div>
        );
    }

    if (hasLogoutFailureError) {
        return (
            <LogoutRequestDenied
                errorMessage={USER_DENIED_LOGOUT}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
            />
        );
    }

    return (
        <DefaultLayout
            isLoading={state.isLoading}
            hasErrors={hasAuthenticationErrors}
        >
            {
                state.isAuthenticated
                    ? (
                        <><div>
                            <h1>Grama App</h1>
                            <br />
                        

                                <li>
                                    {/* Endpoint to route to About component */}
                                    <Link to="/getGramaCert">Apply for Grama Cert</Link>
                                </li>
                                <li>
                                    {/* Endpoint to route to Contact Us component */}
                                    <Link to="/viewPoliceReportStatus">Check Status</Link>
                                </li>
                            
                        </div><><div className="content">
                        <AuthenticationResponse
                                derivedResponse={derivedAuthenticationState} />
                            <br />
                            <button
                                className="btn primary mt-4"
                                onClick={() => {
                                    handleLogout();
                                }}
                            >
                                Logout
                            </button>
                        </div></></>
                    )
                    : (
                        <div className="content">


                            <button
                                className="btn primary"
                                onClick={() => {
                                    handleLogin();
                                }}
                            >
                                Login
                            </button>
                        </div>
                    )
            }
        </DefaultLayout>
    );
};



/**
 * Home page for the Sample.
 *
 * @param {HomePagePropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const HomePagePoliceReport: FunctionComponent<HomePagePropsInterface> = (): ReactElement => {

    const {
        state,
        signIn,
        signOut,
        getBasicUserInfo,
        getIDToken,
        getDecodedIDToken,
        on
    } = useAuthContext();

    const [derivedAuthenticationState, setDerivedAuthenticationState] = useState<any>(null);
    const [hasAuthenticationErrors, setHasAuthenticationErrors] = useState<boolean>(false);
    const [hasLogoutFailureError, setHasLogoutFailureError] = useState<boolean>();

    const search = useLocation().search;
    const stateParam = new URLSearchParams(search).get('state');
    const errorDescParam = new URLSearchParams(search).get('error_description');

    useEffect(() => {

        if (!state?.isAuthenticated) {
            return;
        }

        (async (): Promise<void> => {
            const basicUserInfo = await getBasicUserInfo();
            const idToken = await getIDToken();
            const decodedIDToken = await getDecodedIDToken();

            const derivedState = {
                authenticateResponse: basicUserInfo,
                idToken: idToken.split("."),
                decodedIdTokenHeader: JSON.parse(atob(idToken.split(".")[0])),
                decodedIDTokenPayload: decodedIDToken
            };

            setDerivedAuthenticationState(derivedState);
        })();
    }, [state.isAuthenticated]);

    useEffect(() => {
        if (stateParam && errorDescParam) {
            if (errorDescParam === "End User denied the logout request") {
                setHasLogoutFailureError(true);
            }
        }
    }, [stateParam, errorDescParam]);

    /**
      * handles the error occurs when the logout consent page is enabled
      * and the user clicks 'NO' at the logout consent page
      */
    useEffect(() => {
        on(Hooks.SignOut, () => {
            setHasLogoutFailureError(false);
        });

        on(Hooks.SignOutFailed, () => {
            if (!errorDescParam) {
                handleLogin();
            }
        })
    }, [on]);

    const handleLogin = () => {
        setHasLogoutFailureError(false);
        signIn()
            .catch(() => setHasAuthenticationErrors(true));
    };

    const handleLogout = () => {
        signOut();
    };

    const handlePoliceReport = () => {
        signOut();
    };

    // If `clientID` is not defined in `config.json`, show a UI warning. 
    if (!authConfig?.clientID) {

        return (
            <div className="content">
                <h2>You need to update the Client ID to proceed.</h2>
                <p>Please open "src/config.json" file using an editor, and update
                    the <code>clientID</code> value with the registered application's client ID.</p>
                <p>Visit repo <a
                    href="https://github.com/asgardeo/asgardeo-auth-react-sdk/tree/master/samples/asgardeo-react-app">README</a> for
                    more details.</p>
            </div>
        );
    }

    if (hasLogoutFailureError) {
        return (
            <LogoutRequestDenied
                errorMessage={USER_DENIED_LOGOUT}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
            />
        );
    }

    return (
        <DefaultLayout
            isLoading={state.isLoading}
            hasErrors={hasAuthenticationErrors}
        >
            {
                state.isAuthenticated
                    ? (
                        <><div>
                            <h1>Grama Cert Request</h1>
                            <br />
                            <RequestGramaCertResponse
                                derivedResponse={derivedAuthenticationState} />
                            <br />
                            <button
                                className="btn primary mt-4"
                                onClick={() => {
                                    handleLogout();
                                }}
                            >
                                Logout
                            </button>
                        </div></>
                    )
                    : (
                        <div className="content">

                            <button
                                className="btn primary"
                                onClick={() => {
                                    handleLogin();
                                }}
                            >
                                Login
                            </button>
                        </div>
                    )
            }
        </DefaultLayout>
    );
};