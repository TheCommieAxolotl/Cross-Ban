import path from "path";
import fs from "fs";

const STORE_NAMES = {
    KEYS: "keys.json",
};

const __dirname = new URL(".", import.meta.url).pathname;

const dir = path.join(__dirname, "..", "data");

const validate = (store: keyof typeof STORE_NAMES) => {
    if (!STORE_NAMES[store]) {
        throw new Error(`Invalid store name: ${store}`);
    }

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    if (!fs.existsSync(path.join(dir, STORE_NAMES[store]))) {
        fs.writeFileSync(path.join(dir, STORE_NAMES[store]), "{}");
    }
};

export const getAllData = (store: keyof typeof STORE_NAMES) => {
    validate(store);

    try {
        if (!fs.existsSync(path.join(dir, STORE_NAMES[store]))) return {};
        return JSON.parse(fs.readFileSync(path.join(dir, STORE_NAMES[store]), "utf8"));
    } catch (e) {
        console.error(e);
    }
};

export const getData = (store: keyof typeof STORE_NAMES, key: string | number | symbol) => {
    validate(store);

    try {
        const data = getAllData(store);
        return data[key] || null;
    } catch (e) {
        console.error(e);
    }
};

export const setData = (store: keyof typeof STORE_NAMES, key: string | number | symbol, value: any) => {
    validate(store);

    try {
        const data = getAllData(store);
        data[key] = value;
        fs.writeFileSync(path.join(dir, STORE_NAMES[store]), JSON.stringify(data));
    } catch (e) {
        console.error(e);
    }
};

export const deleteData = (store: keyof typeof STORE_NAMES, key: string | number | symbol) => {
    validate(store);

    try {
        const data = getAllData(store);
        delete data[key];
        fs.writeFileSync(path.join(dir, STORE_NAMES[store]), JSON.stringify(data));
    } catch (e) {
        console.error(e);
    }
};

const SreamCache = {};

export const Stream = (store: keyof typeof STORE_NAMES) => {
    let cache: { [x: string | symbol]: any };

    if (SreamCache[store]) {
        cache = SreamCache[store];
    } else {
        cache = getAllData(store);
        SreamCache[store] = cache;
    }

    return new Proxy(cache, {
        get(_, prop) {
            return cache[prop] || getData(store, prop);
        },

        set(_, prop, value) {
            cache[prop] = value;
            setData(store, prop, value);

            return true;
        },

        deleteProperty(_, prop) {
            cache[prop] = undefined;
            deleteData(store, prop);

            return true;
        },
    });
};
