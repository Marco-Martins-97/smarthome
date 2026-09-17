import * as productService from "../services/product.service.js";

export async function create(req, res) {
    try {
        const product = await productService.create(req.body);

        return res.status(201).json({ message: 'New product created', product });
    } catch (error) {
        console.error(error);

        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({ error: 'The product already exists' });
        }

        if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
            return res.status(404).json({ error: 'One or more referred resources do not exist' });
        }

        // logError(error);
        return res.status(500).json({ error: error.statusCode === 500 ? error.message : 'Internal server error!' });
    }
}

export async function search(req, res) {
    try {
        const result = await productService.search(req.query);

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);

        if (error.statusCode === 404) {
            return res.status(404).json({ error: error.message });
        }

        // logError(error);
        return res.status(500).json({ error: 'Internal server error!' });
    }
}

export async function get(req, res) {
    try {
        const product = await productService.get(req.params.id);

        return res.status(200).json(product);
    } catch (error) {
        console.error(error);

        if (error.statusCode === 404) {
            return res.status(404).json({ error: error.message });
        }

        // logError(error);
        return res.status(500).json({ error: 'Internal server error!' });
    }
}

export async function update(req, res) {
    try {
        const product = await productService.update(req.params.id, req.body);

        return res.status(200).json({ message: 'Product updated', product });
    } catch (error) {
        console.error(error);

        if (error.statusCode === 400) {
            return res.status(400).json({ error: error.message });
        }

        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({ error: 'The product already exists' });
        }

        if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
            return res.status(404).json({ error: 'One or more referred resources do not exist' });
        }

        // logError(error);
        return res.status(500).json({ error: error.statusCode === 500 ? error.message : 'Internal server error!' });
    }
}

export async function enable(req, res) {
    try {
        const product = await productService.switchState(req.params.id, 1);   // 1 is active

        return res.status(200).json({ message: `Product id: ${product.id} is now enable`, product });
    } catch (error) {
        console.error(error);

        if (error.statusCode === 404) {
            return res.status(404).json({ error: error.message });
        }

        if (error.statusCode === 409) {
            return res.status(409).json({ error: 'Product is already active' });
        }

        // logError(error);
        return res.status(500).json({ error: error.statusCode === 500 ? error.message : 'Internal server error!' });
    }
}

export async function disable(req, res) {
    try {
        const product = await productService.switchState(req.params.id, 0);   // 0 is disable

        return res.status(200).json({ message: `Product id: ${product.id} is now disable`, product });
    } catch (error) {
        console.error(error);

        if (error.statusCode === 404) {
            return res.status(404).json({ error: error.message });
        }

        if (error.statusCode === 409) {
            return res.status(409).json({ error: 'Product is already disable' });
        }

        // logError(error);
        return res.status(500).json({ error: error.statusCode === 500 ? error.message : 'Internal server error!' });
    }
}

export async function remove(req, res) {
    try {
        await productService.remove(req.params.id);

        return res.status(200).json({ message: `Product has been removed` });
    } catch (error) {
        console.error(error);

        if (error.statusCode === 404) {
            return res.status(404).json({ error: error.message });
        }

        // logError(error);
        return res.status(500).json({ error: error.statusCode === 500 ? error.message : 'Internal server error!' });
    }
}