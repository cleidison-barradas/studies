import IAuthRequest from "./interfaces/AuthRequest";
import { StoreRepository, User, UserRepository } from "@mypharma/api-core";
import { generateTokens } from "../../services/jwt";
const { DATABASE_MASTER_NAME } = process.env;
import sha1 from 'sha1';

export default class SessionService {
    async authenticateUser({ userName, password, role = "store" }: IAuthRequest) {
        let user = await UserRepository.repo(DATABASE_MASTER_NAME).findOne({
            where: {userName, status: 'active', role}
        });

        if(!user){
            throw new Error("invalid credentials");
        }

        const encryptedPassword = sha1(user.salt + sha1(user.salt + sha1(password)));
        if(user.password !== encryptedPassword){
            throw new Error("invalid credentials");
        }
        const {tenant} = await StoreRepository.repo(DATABASE_MASTER_NAME).findById(user.store[0]);
        const { refreshToken, accessToken, publicKey } = generateTokens(user, tenant);
        
        return {
            accessToken,
            refreshToken,
            publicKey,
            tenant
        };
    }
}