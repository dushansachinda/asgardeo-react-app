/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { CryptoUtils, DecodedIDTokenPayload, JWKInterface } from "../models";
export declare class CryptoHelper<T = any> {
    private _cryptoUtils;
    constructor(cryptoUtils: CryptoUtils<T>);
    /**
     * Generate code verifier.
     *
     * @return {string} code verifier.
     */
    getCodeVerifier(): string;
    /**
     * Derive code challenge from the code verifier.
     *
     * @param {string} verifier.
     *
     * @return {string} code challenge.
     */
    getCodeChallenge(verifier: string): string;
    /**
     * Get JWK used for the id_token
     *
     * @param {string} jwtHeader header of the id_token.
     * @param {JWKInterface[]} keys jwks response.
     *
     * @return {JWKInterface} public key.
     *
     * @throws {AsgardeoAuthException}
     */
    getJWKForTheIdToken(jwtHeader: string, keys: JWKInterface[]): JWKInterface;
    /**
     * Verify id token.
     *
     * @param idToken id_token received from the IdP.
     * @param {JWKInterface} jwk public key used for signing.
     * @param {string} clientID app identification.
     * @param {string} issuer id_token issuer.
     * @param {string} username Username.
     * @param {number} clockTolerance - Allowed leeway for id_tokens (in seconds).
     *
     * @return {Promise<boolean>} whether the id_token is valid.
     *
     * @throws {AsgardeoAuthException} if the id_token is invalid.
     */
    isValidIdToken(idToken: string, jwk: JWKInterface, clientID: string, issuer: string, username: string, clockTolerance: number | undefined): Promise<boolean>;
    /**
     * This function decodes the payload of an id token and returns it.
     *
     * @param {string} idToken - The id token to be decoded.
     *
     * @return {DecodedIdTokenPayloadInterface} - The decoded payload of the id token.
     *
     * @throws {AsgardeoAuthException}
     */
    decodeIDToken(idToken: string): DecodedIDTokenPayload;
}
//# sourceMappingURL=crypto-helper.d.ts.map