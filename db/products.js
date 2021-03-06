/*
 Exports a function products, which returns functions for interacting with a
 product model throught a databases passed in query function.
 */
const { query } = require('./index')

const productsModel = {
    async getAll() {
        const text = `
            SELECT *
            FROM products
        `
        const res = await query(text)
        return res.rows
    },

    async find(id) {
        const text = `
            SELECT *
            FROM products
            WHERE id = $1
        `
        const params = [id]

        const res = await query(text, params)
        return res.rows[0]
    },

    async create({ name, description, price}) {
        const text = `
            INSERT INTO products (name, description, price)
            VALUES ($1, $2, $3)
            RETURNING *
        `
        const params = [name, description, price]
        if (!name) {
            throw(new Error('cannot create product without name'))
        }
        const res = await query(text, params)
        return res.rows[0]
    },

    async delete(id) {
        const text = `
            DELETE FROM products
            WHERE  id = $1
            RETURNING *
        `
        const params = [id]
        const res = await query(text, params)
        return res.rows[0]
    },

    async update({id, name, price, description}) {
        const text = `
            UPDATE products
            SET name = $1,
                price = $2,
                description = $3
            WHERE id = $4
            RETURNING *
        `
        if (!id) {
            throw new(Error('Cannot update product without id'))
        }
        const params = [name, price, description, id]
        const res = await query(text, params)
        return res.rows[0]
    }
}

module.exports = productsModel