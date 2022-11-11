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

import { BasicUserInfo } from "@asgardeo/auth-react";
import React, { FunctionComponent, ReactElement, useState, } from "react";
import ReactJson from "react-json-view";
import { useAsgardeoToken } from './hooks/auth';
import { default as asgardeoSdkConfig } from './config/asgardeo.json';

//export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
/**
 * Decoded ID Token Response component Prop types interface.
 */
interface RequestGramaCertResponsePropsInterface {
    /**
     * Derived Authenticated Response.
     */
    derivedResponse?: any;
}

export interface DerivedARequestGramaCertResponseInterface {
    /**
     * Response from the `getBasicUserInfo()` function from the SDK context.
     */
    authenticateResponse: BasicUserInfo;
    /**
     * ID token split by `.`.
     */
    idToken: string[];
    /**
     * Decoded Header of the ID Token.
     */
    decodedIdTokenHeader: Record<string, unknown>;
    /**
     * Decoded Payload of the ID Token.
     */
    decodedIDTokenPayload: Record<string, unknown>;
}

/**
 * Displays the derived Authentication Response from the SDK.
 *
 * @param {AuthenticationResponsePropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const RequestGramaCertResponse: FunctionComponent<RequestGramaCertResponsePropsInterface> = (
    props: RequestGramaCertResponsePropsInterface
): ReactElement => {

    const {
        endpoints: { tokenEndpoint },
        clientID,
        stsTokenEndpoint,
        stsConfig,
        REACT_APP_API_BASE_URL
    } = asgardeoSdkConfig;

    const {
        derivedResponse
    } = props;
    let bar = props.derivedResponse?.decodedIDTokenPayload.username
    //alert("email test" + bar);
    const { isAsgardeoLoading, isChoreoTokenLoading, choreoTokenData, asgardeoStatus, choreoStatus, asgardeoError, choreoError, asgardeoTokenData } = useAsgardeoToken();
    var [name, setName] = useState("");
    var [email, setEmail] = useState("");
    var [mobileNumber, setMobileNumber] = useState("");
    var [message, setMessage] = useState("");
    var [ssnno, setSsnno] = useState("");
    var [address, setAddress] = useState("");

    //setEmail(bar);

    let handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            let res = await fetch(REACT_APP_API_BASE_URL+"/gramaCertRequest",
                {
                    headers: {
                        Authorization: `bearer ${choreoTokenData.access_token}`,
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({
                        username: name = props.derivedResponse?.decodedIDTokenPayload.username,
                        email: email,
                        mobileNumber: mobileNumber,
                        ssn: ssnno,
                    }),
                });
            let resJson = await res.json();
            //alert("Chore invoke done" + resJson);
            if (res.status === 200) {
                //setName(test);
                var emailval = derivedResponse?.decodedIDTokenPayload.username;
                var ssn = derivedResponse?.decodedIDTokenPayload.ssn;
                setEmail(emailval);
                setSsnno(ssn);
                //alert(ssn);
                setMessage("Grama Cert Request Submitted Successfully! Your Reference# is "+resJson.ref);
            } else {
                setMessage("Some error occured");
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <>
            <div className="form">
                <div className="form-body">
                    <form onSubmit={handleSubmit}>
                        <div className="email"><label className="form__label">Email</label>
                            <input className="form_input"
                                type="text"
                                value={email = derivedResponse?.decodedIDTokenPayload.username}
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mobile"><label className="form__label">Mobile</label>
                            <input className="form_input"
                                type="text"
                                value={mobileNumber = derivedResponse?.decodedIDTokenPayload.phone_number}
                                placeholder="Mobile Number"
                                onChange={(e) => setMobileNumber(e.target.value)}
                            />
                        </div>
                        <div className="ssn"><label className="form__label">SSN</label>
                            <input className="form_input"
                                type="text"
                                value={ssnno = derivedResponse?.decodedIDTokenPayload.ssn}
                                placeholder="ssn"
                                onChange={(e) => setSsnno(e.target.value)}
                            />
                        </div>
                        <br />
                        <div className="footer" >
                            <button type="submit">Submit</button>
                        </div>
                        <div className="message">{message ? <p>{message}</p> : null}</div>
                    </form>
                </div>
            </div>
        </>
    );
};



