import bcrypt from "bcrypt";

export function hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(5);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

export function comparePassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
}
