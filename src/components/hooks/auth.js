import React, { useState, useEffect, useCallback } from 'react';

//import { ASGARDEO_STATE_SUFFIX_CHOREO, generateCodeVerifier, generateHash } from "../utils/auth";
import { default as asgardeoSdkConfig } from '../../components/config/asgardeo.json';
import { useLocation } from 'react-router-dom';
import { Hooks, useAuthContext } from "@asgardeo/auth-react";

const signInRedirectURL = process.env.REACT_APP_signInRedirectURL;

export const useAsgardeoToken = () => {
    const [asgardeoTokenData, setAsgardeoData] = useState();
    const [isAsgardeoLoading, setAsgardeoIsLoading] = useState(true);
    const [asgardeoError, setAsgardeoError] = useState();
    const [asgardeoStatus, setAsgardeoStatus] = useState('initial');

    const [choreoTokenData, setChoreoToken] = useState();
    const [isChoreoTokenLoading, setIsChoreoTokenLoading] = useState(true);
    const [choreoError, setChoreoError] = useState();
    const [choreoStatus, setChoreoStatus] = useState('initial');

    const {
        endpoints: { tokenEndpoint },
        clientID,
        stsTokenEndpoint,
        stsConfig
    } = asgardeoSdkConfig;

    const { search } = useLocation();

    const {
        state,
        signIn,
        signOut,
        getBasicUserInfo,
        getIDToken,
        getDecodedIDToken,
        on
    } = useAuthContext();

    useEffect(() => {
        (async () => {
            //setIsChoreoTokenLoading(true);
            const { client_id, orgHandle, scope } = stsConfig;
            //const { id_token, access_token } = await getIDToken();
            const idToken = await getIDToken();
            const formBody = new URLSearchParams({
                //client_id: client_id,
                grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
                subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
                //scope: scope.join('+'),
                subject_token: idToken,
                //orgHandle,
            });
            try {
                const response = await fetch(stsTokenEndpoint, {
                    "headers": {
                        "Authorization": `Basic SElLcHQ5WkJXYmFLRURUZjhwVkx4RWZrSm1jYToxWXI3ajJ2MUx1aW5LQnNUNGZjcWthYlBVWElh`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    "body": formBody,
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                });
                if (!response.ok) {
                    setChoreoError(response);
                    console.error(response);
                    setChoreoStatus('error');
                } else {
                    const data = await response.json();
                    alert("token exchange done"+data);
                    setChoreoToken(data);
                    setChoreoStatus('success');
                }
            } catch (error) {
                setChoreoError(error);
                console.error(error);
                setChoreoStatus('error');
            } finally {
                sessionStorage.removeItem('pkce_code_verifier#0')
                setIsChoreoTokenLoading(false);
            }
        })();

    }, [asgardeoStatus])
    return { asgardeoTokenData, isAsgardeoLoading, asgardeoError, asgardeoStatus, choreoTokenData, isChoreoTokenLoading, choreoError, choreoStatus }
}