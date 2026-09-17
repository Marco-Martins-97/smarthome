import * as productModel from "../models/product.model.js"

const euroToCent = (value) => { return Math.round(value * 100); };
const centToEuro = (value) => { return value / 100; };

export async function create(data) {
    data.price = euroToCent(data.price);
    data.category_id = data.category_id || null;
    data.store_id = data.store_id || null;
    data.size = data.unit === 'unit' ? 1 : (data.size || 1);
    data.brand = data.brand || null;
    data.image = data.image || null;
    data.barcode = data.barcode || null;
    data.description = data.description || null;

    const result = productModel.create(data);

    if (result.changes !== 1) throw Object.assign(new Error('Failed to create product'), { statusCode: 500 });

    const product = productModel.findById(result.lastInsertRowid);
    product.price = centToEuro(product.price);

    return product;
};

export async function search(query) {
    const { name, min_price, max_price, category_id, store_id, brand, barcode, page, limit } = query;

    const currentPage = Number(page) || 1;
    const itemsPerPage = Number(limit) || 10;
    const filters = {
        name,
        min_price: min_price ? euroToCent(min_price) : undefined,
        max_price: max_price ? euroToCent(max_price) : undefined,
        category_id,
        store_id,
        brand,
        barcode
    };
    const offset = (currentPage - 1) * itemsPerPage;

    const result = productModel.findAll(filters, offset, itemsPerPage);

    if (!result) throw Object.assign(new Error('No products found'), { statusCode: 404 });

    return {
        products: result.products.map(product => ({
            ...product,
            price: centToEuro(product.price)
        })),
        pagination: {
            page: currentPage,
            limit: itemsPerPage,
            total: result.total,
            totalPages: Math.ceil(result.total / itemsPerPage)
        }
    }
};

export async function get(id) {
    const product = productModel.findById(id);

    if (!product) throw Object.assign(new Error('Product does not exist'), { statusCode: 404 });

    product.price = centToEuro(product.price);

    return product;
};

export async function update(id, data) {
    if (!data || Object.keys(data).length === 0) throw Object.assign(new Error('No data provided for update'), { statusCode: 400 });

    if (data.price !== undefined) data.price = euroToCent(data.price);

    const result = productModel.update(id, data);

    if (!result) throw Object.assign(new Error('No valid data provided'), { statusCode: 400 });
    if (result.changes !== 1) throw Object.assign(new Error('Failed to update product'), { statusCode: 500 });

    const product = productModel.findById(id);
    product.price = centToEuro(product.price);

    return product;
};

export async function switchState(id, state) {
    let product = productModel.findById(id);

    if (!product) throw Object.assign(new Error('Product does not exist'), { statusCode: 404 });

    if (product.is_active === state) throw Object.assign(new Error('Product is already on this state'), { statusCode: 409 });

    const result = productModel.switchState(id, state);

    if (result.changes !== 1) throw Object.assign(new Error('Failed to update product state'), { statusCode: 500 });

    product = productModel.findById(id);
    product.price = centToEuro(product.price);

    return product;
}

export async function remove(id) {
    const product = productModel.findById(id);

    if (!product) throw Object.assign(new Error('Product does not exist'), { statusCode: 404 });

    const result = productModel.remove(id);

    if (result.changes !== 1) throw Object.assign(new Error('Failed to delete product'), { statusCode: 500 });
};