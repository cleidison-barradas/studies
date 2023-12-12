import { User } from "@mypharma/api-core";
import jwt from "jsonwebtoken";
import NodeRSA from "node-rsa";
import {jwtConfig} from "../config/jwt"; 
import {TokenGenerator, TokenBase} from 'ts-token-generator';

interface IJwtSign {
    userId: string | User['_id']
    email: string
    tenant: string
}

const createKeyPair = () => {
    console.log("Generating JWT key pairs...");
    const rsa = new NodeRSA({ b: 256 });
    const keyPair = rsa.generateKeyPair();

    const privateKey = keyPair.exportKey('pkcs1-private');
    const publicKey = keyPair.exportKey('pkcs1-public');

    console.log("JWT keys pairs were generate!");

    return {
        privateKey,
        publicKey
    }
}

const jwtSign = ({userId, email, tenant}: IJwtSign) => {
    const { privateKey, publicKey } = createKeyPair();

    const token = jwt.sign({userId, email, tenant}, privateKey, jwtConfig);
    return {token, publicKey};
}

const jwtVerify = (token: string, publicKey: string) => {
    try {
        const payload = jwt.verify(token, publicKey, jwtConfig);
        return payload;
    } catch (error) {
        return undefined
    }
   
}

const generateTokens = (user: User, tenant: string) => {
    
    const tokenGen = new TokenGenerator({bitSize: 512, baseEncoding: TokenBase.BASE71});
    const refreshToken = tokenGen.generate();

    const {token: accessToken, publicKey} = jwtSign({ userId: user._id, email: user.email, tenant });

    return {
        refreshToken,
        accessToken,
        publicKey
    }
}

export {
    generateTokens,
    jwtVerify
}