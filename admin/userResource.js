import bcrypt from "bcrypt";

function makeUserResource(database) {
    return {
        resource: database.table("users"),
        options: {
            properties: {
                password_hash: { isVisible: false }, // скрывать оригинальное поле
                password: {
                    type: "string",
                    isVisible: { list: false, filter: false, show: false, edit: true }
                }
            },
            actions: {
                new: {
                    before: async (request) => {
                        if (request.payload.password) {
                            const hashed = await bcrypt.hash(request.payload.password, 10);
                            request.payload.password_hash = hashed;
                            delete request.payload.password;
                        }
                        return request;
                    }
                },
                edit: {
                    before: async (request) => {
                        if (request.payload.password) {
                            const hashed = await bcrypt.hash(request.payload.password, 10);
                            request.payload.password_hash = hashed;
                            delete request.payload.password;
                        }
                        return request;
                    }
                }
            }
        }
    };
}

export default makeUserResource;