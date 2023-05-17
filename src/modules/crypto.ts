import crypto from "node:crypto";

export const encrypt = (data: string) => {
    const hash = crypto.createCipheriv("aes-256-cbc", process.env.HASH_SECRET, Buffer.alloc(16, 0));

    let encrypted = hash.update(data, "utf8", "hex");

    encrypted += hash.final("hex");

    return encrypted;
};

export const decrypt = (hmac: string) => {
    const hash = crypto.createDecipheriv("aes-256-cbc", process.env.HASH_SECRET, Buffer.alloc(16, 0));

    let decrypted = hash.update(hmac, "hex", "utf8");

    decrypted += hash.final("utf8");

    return decrypted;
};

export const hash = (data?: string) => {
    const hash = crypto.createHash("sha256");

    hash.update(data || crypto.randomBytes(32).toString("hex"));

    return hash.digest("hex");
};
