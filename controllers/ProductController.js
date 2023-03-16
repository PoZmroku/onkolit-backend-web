import ProductModel from "../models/Product.js";

export const getProducts = async (req, res) => {
    try{
        const products = await ProductModel.find().populate({ path: 'product', select: ['name', 'description', 'imUrl'] });

        res.json(products)
    } catch (err) {
        res.status(500).json({ message: 'Не удалось получить список товаров, повторите попытку', });
    }
}

export const getProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        ProductModel.findOne({
            _id: productId,
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось получить товар'
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Товар не найден',
                    }); 
                }
            }
            )
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить товары',
        });
    }
}
