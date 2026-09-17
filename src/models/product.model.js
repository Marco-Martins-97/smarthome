import db from "../config/database.js";

export const create = (data) => {
    return db.prepare(`
        INSERT INTO products (name, price, category_id, store_id, unit, size, brand, image, barcode, description)
        VALUES (@name, @price, @category_id, @store_id, @unit, @size, @brand, @image, @barcode, @description)
    `).run(data);
}

export const findAll = (filters, offset, limit) => {
    const conditions = [];
    const params = { offset, limit };

    if (filters.name !== undefined) {
        conditions.push('name LIKE @name');
        params.name = `%${filters.name}%`;
    }
    if (filters.min_price !== undefined) {
        conditions.push('price >= @min_price');
        params.min_price = filters.min_price;
    }
    if (filters.max_price !== undefined) {
        conditions.push('price <= @max_price');
        params.max_price = filters.max_price;
    }
    if (filters.category_id !== undefined) {
        conditions.push('category_id = @category_id');
        params.category_id = filters.category_id;
    }
    if (filters.store_id !== undefined) {
        conditions.push('store_id = @store_id');
        params.store_id = filters.store_id;
    }
    if (filters.brand !== undefined) {
        conditions.push('brand LIKE @brand');
        params.brand = `%${filters.brand}%`;
    }
    if (filters.barcode !== undefined) {
        conditions.push('barcode LIKE @barcode');
        params.barcode = `%${filters.barcode}%`;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const products = db.prepare(`SELECT * FROM products ${where} LIMIT @limit OFFSET @offset`).all(params);
    const { total } = db.prepare(`SELECT COUNT(*) as total FROM products ${where}`).get(params);

    return { products, total };
}

export const findById = (id) => {
    return db.prepare(`SELECT * FROM products WHERE id = @id`).get({ id });
}

export const update = (id, data) => {
    const allowedFields = ['name', 'price', 'category_id', 'store_id', 'unit', 'size', 'brand', 'image', 'barcode', 'description'];

    const fields = [];
    const values = { id };

    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            fields.push(`${field} = @${field}`);
            values[field] = data[field];
        }
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    return db.prepare(`UPDATE products SET ${fields.join(', ')} WHERE id = @id`).run(values)
}

export const switchState = (id, state) => {
    return db.prepare(`UPDATE products SET is_active = @state, updated_at = CURRENT_TIMESTAMP WHERE id = @id`).run({ state, id });
}

export const remove = (id) => {
    return db.prepare(`DELETE FROM products WHERE id = @id`).run({ id });
}