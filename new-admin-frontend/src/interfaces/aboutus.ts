export default interface AboutUs {
    _id?: string,
    user?: object,
    content: string,
    published: boolean,
    deleted?: boolean,
    updatedAt?: Date,
    createdAt?: Date,
}