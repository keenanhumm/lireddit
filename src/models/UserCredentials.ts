import { InputType, Field } from "type-graphql";

@InputType()
export default class UserCredentials {
    @Field()
    username: string;

    @Field()
    password: string;
}
