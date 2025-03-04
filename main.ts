import { Hono } from "@hono/hono";

const app = new Hono();

interface Item {
  id: string;
  value: string;
}

const setItem = (key: string, value: Item) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = (key: string): Item | null => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

const deleteItem = (key: string) => {
  localStorage.removeItem(key);
};

app.get("/", (c) => {
  return c.text("Hello from the Items!");
});

app.post("/items", async (c) => {
  const { id, text} = await c.req.json();
  const Item: Item = { id, text};
  setItem(`Items_${id}`, Item);
  return c.json({
    message: `We just added a ${text} Item!`,
  });
});

app.get("/items/:id", async (c) => {
  const id = await c.req.param("id");
  const Item = getItem(`Items_${id}`);
  if (!Item) {
    return c.json({ message: "Item not found" }, 404);
  }
  return c.json(Item);
});

app.put("/items/:id", async (c) => {
  const id = c.req.param("id");
  const { text } = await c.req.json();
  const updatedItem: Item = { id, text };
  setItem(`Items_${id}`, updatedItem);
  return c.json({
    message: `Item has relocated to ${text}!`,
  });
});

app.delete("/items/:id", (c) => {
  const id = c.req.param("id");
  deleteItem(`Items_${id}`);
  return c.json({
    message: `Item ${id} has been cut down!`,
  });
});

Deno.serve(app.fetch);