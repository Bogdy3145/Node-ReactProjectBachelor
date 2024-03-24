CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL
);

INSERT INTO items (content) VALUES ('Item 1');
INSERT INTO items (content) VALUES ('Item 2');
INSERT INTO items (content) VALUES ('Item 3');
