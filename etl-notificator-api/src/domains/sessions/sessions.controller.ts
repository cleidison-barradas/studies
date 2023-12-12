import { JsonController, Post, Res, Req, Body, UseBefore } from "@mypharma/api-core";
import { Response, Request } from "express";
import IAuthRequest from "./interfaces/AuthRequest";
import SessionService from "./sessions.service";
import multer from 'multer';


@JsonController('/v1/sessions')
export default class SessionController {
    @Post()
    async authenticate(@Res() response: Response, @Body() request: IAuthRequest){
        try {
            const sessionService = new SessionService();
            const authenticatedUser = await sessionService.authenticateUser(request);

            return { ...authenticatedUser }
        } catch (error) {
            console.log(error)
            return response.status(500).json({error});
        }
    }
}