const request = require("supertest");

const app = require("./app");
let items = require("./fakeDb");
const Test = require("supertest/lib/test");

let ketchup = {name: 'ketchup', price: 2.55};

beforeEach(function(){
    items.push(ketchup);
});

afterEach(function(){
    items.length = 0;
});

describe("GET /items", () => {
    test("Get all items", async () =>{
        const res = await request(app).get("/items");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ items: [ketchup]});
    });
});

describe("GET /items/:name", () => {
    test("Get one item", async () =>{
        const res = await request(app).get(`/items/${ketchup.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({item: ketchup});
    });

    test("Responds with 404 for invalid name", async () =>{
        const res = await request(app).get(`/items/teriyaki`);
        expect(res.statusCode).toBe(404);
    });
});

describe("POST /items", () => {
    test("Adding a new item", async () => {
        const res = await request(app).post("/items").send({name: 'mustard', price: 1.25});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ added: { name: 'mustard', price: 1.25 } });
    });
});

describe("PATCH /items/:name", () =>{
    test("Updating an item's name/price", async () => {
        const res = await request(app).patch(`/items/${ketchup.name}`).send({name: "Mayo", price: 2.00});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({updated: {name: "Mayo", price: 2.00}});
    });
    test("Responds with 404 for invalid name", async () => {
        const res = await request(app).patch(`/items/Ranch`).send({name: "Mayo", price: 2.00});
        expect(res.statusCode).toBe(404);
    });
});

describe("DELETE /items/:name", () => {
    test("Deleting an item", async () => {
        const res = await request(app).delete(`/items/${ketchup.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({message: 'Deleted'});
    });

    test("Responds with 404 for invalid name", async () => {
        const res = await request(app).delete(`/items/worcheshire`);
        expect(res.statusCode).toBe(404);
    });
});